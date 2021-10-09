---
title: Gitlab CI/CD之.gitlab-ci.yml常用配置说明
date: 2021-07-23 14:29:45
tags:
  - gitlab
  - ci/cd
---

这里记录着我在配置`.gitlab-ci.yml`过程中碰到的常用的几个配置，对其进行分类解释说明，方便后续理解与查阅。

我的一个完整的`.gitlab-ci.yml`示例：

```yml
# default stages: .pre build test deploy .post
# my stages: pre test build deploy post
stages:
  - pre # install
  - test # lint, sonar_check, unit_test
  - build # build, build_with_sentry
  - deploy # deploy_testing, deploy_production (upload to cdn or server)
  - post # clean if needed

variables:
  BUILD_DIR_FOR_TESTING: pre
  BUILD_DIR_FOR_PRODUCTION: dist
  URL_FOR_TESTING: https://test-demo.example.com/
  URL_FOR_PRODUCTION: https://demo.example.com/

cache: &global_cache
  untracked: true
  key: $CI_COMMIT_REF_SLUG
  paths:
    - node_modules/
  policy: pull-push

.common:
  tags:
    - gr

############ stage: pre ############

install:
  extends: .common
  stage: pre
  script:
    - npm install
  cache:
    <<: *global_cache
    policy: push
  rules:
    - if: $CI_COMMIT_REF_NAME =~ /^dev$|^master$/
      changes:
        - package.json
        - package-lock.json
        - yarn.lock
    - if: $CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME =~ /^dev$|^master$/
      changes:
        - package.json
        - package-lock.json
        - yarn.lock

############ stage: test ############

lint:
  extends: .common
  stage: test
  cache:
    <<: *global_cache
  script:
    - echo "==== 代码校验 ===="
    - npm run lint
  rules:
    - if: $CI_COMMIT_REF_NAME =~ /^dev$|^master$/
    - if: $CI_PIPELINE_SOURCE == "merge_request_event" && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME =~ /^dev$|^master$/

sonar_check:
  extends: .common
  stage: test
  script:
    - echo "==== SONAR ANALYSIS ===="
  allow_failure: true
  when: manual
  only:
    - dev
    - master

############ stage: build ############

build_testing:
  extends: .common
  stage: build
  cache:
    <<: *global_cache
    policy: pull
  script:
    - echo "==== 测试构建 ===="
    - npm run pre
  artifacts:
    name: '$CI_PROJECT_NAME-$CI_COMMIT_REF_NAME-$CI_COMMIT_SHORT_SHA-testing'
    expire_in: 1 week
    paths:
      - $BUILD_DIR_FOR_TESTING/
  only:
    - dev

build_production:
  extends: .common
  stage: build
  cache:
    <<: *global_cache
    policy: pull
  script:
    - echo "==== 生产构建 ===="
    - npm run build
  artifacts:
    name: '$CI_PROJECT_NAME-$CI_COMMIT_REF_NAME-$CI_COMMIT_SHORT_SHA-production'
    expire_in: 1 week
    paths:
      - $BUILD_DIR_FOR_PRODUCTION/
  only:
    - master

############ stage: deploy ############

deploy_testing:
  extends: .common
  stage: deploy
  script:
    - echo "测试环境代码发布"
  after_script:
    - echo "发布成功："$URL_FOR_TESTING
  environment:
    name: testing
    url: $URL_FOR_TESTING
  when: manual
  only:
    - dev

deploy_production:
  extends: .common
  stage: deploy
  script:
    - echo "生产环境代码发布"
  after_script:
    - echo "发布成功："$URL_FOR_PRODUCTION
  environment:
    name: production
    url: $URL_FOR_PRODUCTION
  when: manual
  only:
    - master
```

{% post_link Gitlab-CI-CD之-gitlab-ci-yml复用类配置 %}：

- Anchors
- !reference
- extend
- include

条件类配置：

- only
- except
- rules
- when

脚本类配置：

- before_script
- script
- after_script

缓存类配置：

- cache
- artifacts
