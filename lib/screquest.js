const Promise = require('es6-promise').Promise

const defaults = require('./defaults')
const forEach = require('./forEach')
const merge = require('./merge')
const transformData = require('./transformData')


let screquest = module.exports = function screquest (options) {
  options = merge({
    method: 'get',
    transformRequest: defaults.transformRequest,
    transformResponse: defaults.transformResponse
  }, options)

  let promise = new Promise((resolve, reject) => {
    let request = new (XMLHttpRequest || ActiveXObject)('Microsoft.XMLHTTP')
    const data = transformData(options.data, options.headers, options.transformRequest)

    request.open(options.method, options.url, true)
    request.onreadystatechange = () => {
      if (request && request.readyState === 4) {
        const response = {
          data: transformData(request.responseText, options.headers, options.transformResponse),
          status: request.status,
          headers: headers,
          config: options
        }

        if (request.status >= 200 && request.status <= 300) {
          resolve(response)
        } else {
          reject(response)
        }
        
        // Clean up request
        request = null
      }
    }

    const headers = merge(
      defaults.headers.common,
      defaults.headers[options.method] || {},
      options.headers || {}
    )

    forEach(headers, (val, key) => {
      // Remove Content-Type if data is undefined
      if (typeof data === 'undefined' &&
          key.toLowerCase() === 'content-type') {
        delete headers[key];
      }
      // Otherwise add header to the request
      else {
        request.setRequestHeader(key, val);
      }
    })

    request.send(data)
  })

  promise.success = function success(fn) {
    promise.then(response => {
      fn(response)
    })

    return promise
  }

  promise.error = function error (fn) {
    promise.then(null, response => {
      fn(response)
    })

    return promise
  }

  return promise
}

screquest.defaults = defaults

createShortMethods('delete', 'get', 'head')
createShortMethodsWithData('post', 'put', 'patch')

function createShortMethods () {
  forEach (arguments, method => {
    screquest[method] = (url, options) => {
      return screquest(merge(options || {}, {
        method: method,
        url: url
      }))
    }
  })
}

function createShortMethodsWithData () {
  forEach (arguments, method => {
    screquest[method] = (url, data, options) => {
      return screquest(merge(options || {}, {
        method: method,
        url: url,
        data: data
      }))
    }
  })
}
