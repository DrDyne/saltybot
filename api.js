"use strict";
var settings = require('./settings')
var io = require('superagent')

module.exports = class Api {
  constructor () {
    console.log('plugging cables...')
  }

 resolve (err, res) {
    if ( err ) throw err
    console.log(res.splice(250))
    return res
  }

  get (path) {
    return io.get(settings.api.url + path)
             .set('Accept', 'application/json')
             .end(this.resolve)
  }

  put (data, url) {
  }

  post (data, url) {
  }

  'delete' (url) {
  }
}

