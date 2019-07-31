const forEach = require('./forEach')

module.exports = function transformData (data, headers, fns) {
  if (typeof fns === 'function') {
    return fns(data, headers)
  }

  forEach (fns, fn => {
    data = fn(data, headers)
  })

  return data
}