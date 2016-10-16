"use strict";
var settings = require('../../settings')
var RestClient = require('node-rest-client').Client

module.exports = class Api {
  constructor () {
    console.log('plugging cables...')
    this.io = new RestClient()
  }

 resolve (err, res) {
    if ( err ) throw err
    return res
  }

  get (path) {
    return new Promise((resolve, reject) => {
      console.log('GET %s%s', settings.api.url, path)
      this.io.get(settings.api.url + path, (data, res) => {
        console.log(res.statusCode)
        if ( 404 === res.statusCode ) reject(404)
        console.log(data)
        resolve(data)
      })
    })
  }

  put (data, url) {
  }

  post (data, url) {
  }

  'delete' (url) {
  }
}
