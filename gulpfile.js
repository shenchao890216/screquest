const { src, dest, series } = require('gulp')
const del = require('delete')
const webpackStream = require('webpack-stream')

function clean (cb) {
  del(['dist/**'], cb)
}

function webpack () {
  return src('./index.js')
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'screquest.js',
        library: 'screquest',
        libraryTarget: 'global'
      },
      devtool: '#inline-source-map'
    }))
    .pipe(dest('dist/'))
}

exports.clean = clean
exports.webpack = webpack
exports.default = series(clean, webpack)

