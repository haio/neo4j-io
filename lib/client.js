var Promise = require('bluebird')
var request = require('request-promise')
var debug = require('debug')('neo4j-io:client')

module.exports = Client

function Client (url, mode) {
  url = url || 'http://localhost:7474'
  this.url = url + '/db/data'

  if (mode) {
    this.mode = mode
    this.batchQueue = []
    this.batchId = 0
  }
}

var client = Client.prototype

client._request = function (method, path, data) {
  var url = this.url + path
  var options = {
    url : url,
    method: method,
    headers: {
      'X-Stream':true,
      'Accept': 'application/json; charset=UTF-8',
      'Content-type': 'application/json; charset=UTF-8'
    }
  }

  if (data) {
    options.json = data
  }

  return new Promise (function (resolve, reject) {
    request(options)
      .then(function (body) {
        if (!body) return resolve()

        body = typeof body === 'string'
          ? JSON.parse(body)
          : body
        resolve(body)
      })
      .catch(function (err) {
        var error = new Error()
        error.status = err.statusCode
        error.message = err.response && err.response.body
        debug('error', error)
        reject(error)
      })
  })
}

client.request = function (method, path, data) {

  if (this.mode === 'batch') {
    this.batchQueue.push({
      method: method,
      to: path,
      body: data,
      id: ++this.batchId
    })
    return this.batchId
  }

  return this._request(method, path, data)
}

client.query = function (cypher, params) {
  var data = { query: cypher }
  if (params) data.params = params

  return this.request('POST', '/cypher', data)
}

client.get = function (path) {
  return this.request('GET', path)
}

client.put = function (path, data) {
  return this.request('PUT', path, data)
}

client.delete = function (path, prop) {
  return this.request('DELETE', path, prop)
}

client.post = function (path, data) {
  return this.request('POST', path, data)
}

client.exec = function () {
  var batchQueue = this.batchQueue;
  this.batchQueue = []
  return this._request('POST', '/batch', batchQueue)
}
