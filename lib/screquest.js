const Promise = require('es6-promise').Promise

function screquest (options) {
  options = merge({
    method: 'get',
  }, options)

  let promise = new Promise((resolve, reject) => {
    const request = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0')

    function onload () {
      if (request.status >= 200 && request.status <= 300) {
        resolve(parse(request.responseText))
      } else {
        onerror()
      }
    }

    function onerror () {
      reject(parse(request.responseText) || new Error('Can\'t connet to ' + JSON.stringify(options.url)))
    }

    try {
      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          onload()
        }
      }
      request.open(options.method, options.url, true)

      request.onload = request.load = onload
      request.onerror = request.error = onerror

      const headers = merge(
        defaults.headers.common,
        defaults.headers[options.method] || {},
        options.headers || {}
      )

      for (let key in headers) {
        request.setRequestHeader(key, headers[key])
      }
    } catch (e) {
      reject(e)
    }

    request.send(options.data ? JSON.stringify(options.data) : null)
  })

  promise.success = fn => {
    promise.then(response => {
      fn(response)
    })

    return promise
  }

  promise.error = fn => {
    promise.then(null, response => {
      fn(response)
    })

    return promise
  }

  return promise
}

const CONTENT_TYPE_APPLICATION_JSON = {
  'Content-Type': 'application/json;charset=utf-8'
}

const defaults = screquest.defaults = {
  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    },
    'patch': merge(CONTENT_TYPE_APPLICATION_JSON),
    'post': merge(CONTENT_TYPE_APPLICATION_JSON),
    'put': merge(CONTENT_TYPE_APPLICATION_JSON),
  }
}

function parse (response) {
  try {
    return JSON.parse(response)
  } catch (e) {
    return response
  }
}

function merge () {
  let result = {}

  forEach(arguments, (obj) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key]
      }
    }
  })

  return result
}

function forEach (arr, fn) {
  for (let i = 0, l = arr.length; i < l; i++) {
    console.log('foreach => ', arr[i])
    fn.call(null, arr[i], i, arr)
  }
}

function createShortMethods () {
  forEach (arguments, method => {
    console.log(method)
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

createShortMethods('delete', 'get', 'head')
createShortMethodsWithData('post', 'put', 'patch')

module.exports = screquest