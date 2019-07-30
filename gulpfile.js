const { src, dest } = require('gulp')
const del = require('delete')
const webpackStream = require('webpack-stream')

function defaultTask (cb) {
  cb()
}

function clean (cb) {
  del(['dist/**'], cb)
}

function webpack (cb) {
  return src('./index.js')
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'screquest.js',
        library: 'screquest'
      },
      devtool: '#inline-source-map'
    }))
    .pipe(dest('dist/'))
}

exports.clean = clean
exports.webpack = webpack
exports.default = defaultTask

