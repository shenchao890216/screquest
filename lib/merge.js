const forEach = require('./forEach');

module.exports = function merge(/*obj1, obj2, obj3, ...*/) {
  let result = {}

  forEach(arguments, (obj) => {
    forEach(obj, function (val, key) {
      result[key] = val
    })
  })

  return result
}
