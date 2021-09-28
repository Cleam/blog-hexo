---
title: Gitlab CI/CD之.gitlab-ci.yml复用类配置
date: 2021-09-10 16:56:44
tags:
---

复用类配置：

## 锚点 Anchors

YAML 有一项名为“锚点”的功能，您可以使用它在整个文档中复制内容。

```yml
cache: &global_cache # 定义一个全局缓存的锚点：global_cache
  untracked: true
  key: $CI_COMMIT_REF_SLUG
  paths:
    - node_modules/
  policy: pull-push

install:
  cache:
    <<: *global_cache # 将global_cache合并到当前配置中
    policy: push

lint:
  cache:
    <<: *global_cache # 将global_cache合并到当前配置中
```

`&`设置锚点的名称 (global_cache)，`<<`意思是“将给定的哈希对象合并到当前哈希对象中”，`*`包含命名锚点（如：`global_cache`）。

这个例子的结果是：

```yml
cache: &global_cache # 定义一个全局缓存的锚点：global_cache
  untracked: true
  key: $CI_COMMIT_REF_SLUG
  paths:
    - node_modules/
  policy: pull-push

install:
  cache:
    untracked: true
  key: $CI_COMMIT_REF_SLUG
  paths:
    - node_modules/
  policy: push

lint:
  cache:
    untracked: true
    key: $CI_COMMIT_REF_SLUG
    paths:
      - node_modules/
    policy: pull-push
```

你还可以使用锚点来定义两个服务集合。例如以下示例（`test:postgres`和`test:mysql`共享了`.job_template`的`script`，但是却有这不同的`services`，分别定义在了`.postgres_services`和`.mysql_services`中）：。

```yml
.job_template: &job_configuration
  script:
    - test project
  tags:
    - dev

.postgres_services:
  services: &postgres_configuration
    - postgres
    - ruby

.mysql_services:
  services: &mysql_configuration
    - mysql
    - ruby

test:postgres:
  <<: *job_configuration
  services: *postgres_configuration
  tags:
    - postgres

test:mysql:
  <<: *job_configuration
  services: *mysql_configuration
```

得到的结果将是这样的：

```yml
.job_template:
  script:
    - test project
  tags:
    - dev

.postgres_services:
  services:
    - postgres
    - ruby

.mysql_services:
  services:
    - mysql
    - ruby

test:postgres:
  script:
    - test project
  services:
    - postgres
    - ruby
  tags:
    - postgres

test:mysql:
  script:
    - test project
  services:
    - mysql
    - ruby
  tags:
    - dev
```

我们可以看到隐藏的作业被方便地用作模板，并且`tags: [postgres]` 覆盖了`tags: [dev]`。

**更多锚点的使用示例**：

1. YAML 锚点用于脚本（script）中：

您可以将 YAML 锚点与 `script`、`before_script` 和 `after_script` 结合使用，以便在多个作业中使用预定义的命令：

```yml
.some-script-before: &some-script-before
  - echo "Execute this script first"

.some-script: &some-script
  - echo "Execute this script second"
  - echo "Execute this script too"

.some-script-after: &some-script-after
  - echo "Execute this script last"

job1:
  before_script:
    - *some-script-before
  script:
    - *some-script
    - echo "Execute something, for this job only"
  after_script:
    - *some-script-after

job2:
  script:
    - *some-script-before
    - *some-script
    - echo "Execute something else, for this job only"
    - *some-script-after
```

2. YAML 锚点用于用于变量（variables）中：

使用带有变量的 YAML 锚点在多个作业中重复分配变量。当作业需要特定的变量块时，您还可以使用 YAML 锚点，否则会**覆盖全局变量**。以下示例显示如何覆盖 `GIT_STRATEGY` 变量而不影响 `SAMPLE_VARIABLE` 变量的使用：

```yml
# global variables
variables: &global-variables
  SAMPLE_VARIABLE: sample_variable_value
  ANOTHER_SAMPLE_VARIABLE: another_sample_variable_value

# a job that must set the GIT_STRATEGY variable, yet depend on global variables
job_no_git_strategy:
  stage: cleanup
  variables:
    <<: *global-variables
    GIT_STRATEGY: none
  script: echo $SAMPLE_VARIABLE
```

## 引用 !reference

使用 `!reference` 自定义 YAML 标签从其他作业部分选择关键字配置，并在当前部分中复用它。与锚点不同，您可以使用 `!reference` 标签来复用通过`include`引用的配置文件中的配置。

在以下示例中，`test`作业中重复使用了来自两个不同位置的`script`和`after_script`：

- `setup.yml`:

```yml
.setup:
  script:
    - echo creating environment
```

- `.gitlab-ci.yml`:

```yml
include:
  - local: setup.yml

.teardown:
  after_script:
    - echo deleting environment

test:
  script:
    - !reference [.setup, script]
    - echo running my own command
  after_script:
    - !reference [.teardown, after_script]
```

在以下示例中，`test-vars-1` 复用 `.vars` 中的所有变量，而 `test-vars-2` 选择特定变量并将其复用为新的 `MY_VAR` 变量。

```yml
.vars:
  variables:
    URL: 'http://my-url.internal'
    IMPORTANT_VAR: 'the details'

test-vars-1:
  variables: !reference [.vars, variables]
  script:
    - printenv

test-vars-2:
  variables:
    MY_VAR: !reference [.vars, variables, IMPORTANT_VAR]
  script:
    - printenv
```

您不能重复使用已经包含 `!reference` 标签的部分。仅支持一层嵌套。

## 继承 extend

使用`extends`来复用配置块。它是锚点（Anchor）的替代品，并且更加灵活和可读。您可以使用`extends`来复用通过`include`引用的配置文件中的配置。

在以下示例中，`rspec` 作业使用 `.tests` 模板作业中的配置。GitLab：

- 根据键执行反向深度合并。
- 将 `.tests` 内容与 `rspec` 作业合并。
- 不合并键的值。

```yml
.tests:
  script: rake test
  stage: test
  only:
    refs:
      - branches

rspec:
  extends: .tests
  script: rake rspec
  only:
    variables:
      - $RSPEC
```

`rspec`作业的结果是：

```yml
rspec:
  script: rake rspec
  stage: test
  only:
    refs:
      - branches
    variables:
      - $RSPEC
```

本例中的 `.tests` 是一个[隐藏作业](https://docs.gitlab.com/ee/ci/yaml/#hide-jobs)，但也可以从常规作业中`extends`配置。

`extends` 支持多级继承。 虽然您可以使用多达 11 个级别，但是您应该避免使用 3 个以上的级别。以下示例具有两个继承级别：

```yml
.tests:
  rules:
    - if: $CI_PIPELINE_SOURCE == "push"

.rspec:
  extends: .tests
  script: rake rspec

rspec 1:
  variables:
    RSPEC_SUITE: '1'
  extends: .rspec

rspec 2:
  variables:
    RSPEC_SUITE: '2'
  extends: .rspec

spinach:
  extends: .tests
  script: rake spinach
```

在 GitLab 12.0 及更高版本中，也可以使用多个父项进行扩展（extends）。

您可以用`extends`来合并哈希对象但是不能用来合并数组。用于合并的算法是“就近优先原则（closest scope wins）”，因此来自最后一个成员的键总是覆盖其他级别上定义的任何内容。例如：

```yml
.only-important:
  variables:
    URL: 'http://my-url.internal'
    IMPORTANT_VAR: 'the details'
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
    - if: $CI_COMMIT_BRANCH == "stable"
  tags:
    - production
  script:
    - echo "Hello world!"

.in-docker:
  variables:
    URL: 'http://docker-url.internal'
  tags:
    - docker
  image: alpine

rspec:
  variables:
    GITLAB: 'is-awesome'
  extends:
    - .only-important
    - .in-docker
  script:
    - rake rspec
```

结果是：

```yml
rspec:
  variables:
    URL: 'http://docker-url.internal'
    IMPORTANT_VAR: 'the details'
    GITLAB: 'is-awesome'
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
    - if: $CI_COMMIT_BRANCH == "stable"
  tags:
    - docker
  image: alpine
  script:
    - rake rspec
```

在上面示例中：

- `variables`合并，但 `URL："http://docker-url.internal"` 覆盖 `URL："http://my-url.internal"`。
- `tags：['docker']` 覆盖`tags：['production']`。
- `script`不会合并，但 `script: ['rake rspec']` 会覆盖 `script: ['echo "Hello world!"']`。 您可以使用锚点来合并数组。

**`extends` 和 `include`一起使用**：要复用来自不同配置文件的配置，请结合`extends` 和 `include`。

在下面的示例中，在 `included.yml` 文件中定义了一个脚本`script`。然后，在 `.gitlab-ci.yml` 文件中，使用`extends`继承了那部分脚本内容：

- `included.yml`:

```yml
.template:
  script:
    - echo Hello!
```

- `.gitlab-ci.yml`:

```yml
include: included.yml

useTemplate:
  image: alpine
  extends: .template
```

## 包含 include

> TODO...

## 总结&注意

使用`include`关键字时，您不能跨多个文件使用 YAML 锚点。锚点只在定义它们的文件中有效。要复用来自不同 YAML 文件的配置，请使用`引用（!reference）`或`继承（extends）`。

> 英文原文：
> 锚点 Anchors：https://docs.gitlab.com/ee/ci/yaml/#anchors
> 引用 !reference：https://docs.gitlab.com/ee/ci/yaml/#reference-tags
> 继承 extend：https://docs.gitlab.com/ee/ci/yaml/#extends
> 包含 include：https://docs.gitlab.com/ee/ci/yaml/#include
