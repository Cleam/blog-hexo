function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

function defineReactive(obj, key, value) {
  observe(value);
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      observe(newValue);
      value = newValue;
      update();
    },
  });
}

function observe(obj) {
  if (!isObject(obj)) {
    return;
  }
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
  });
}

function set(obj, key, value) {
  defineReactive(obj, key, value);
}
