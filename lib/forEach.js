module.exports = function forEach (obj, fn) {
  if (typeof obj !== 'object') {
    return
  }

  if (obj.constructor === Array || typeof obj.callee === 'function') {
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn.call(null, obj[key], key, obj)
      }
    }
  }
}
