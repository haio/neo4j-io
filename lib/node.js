var format = require('./utils').format

module.exports = Node

function Node (client) {
  this.client = client
}

var node = Node.prototype

node.get = function (id) {
  var path = format('/node/%s', id)
  return this.client.get(path)
}

node.update = function (id, prop, value) {
  var path = format('/node/%s/properties', id)
  if (typeof prop === 'string') {
    path = path + '/' + prop
    prop = value
  }
  return this.client.put(path, prop)
}

node.create = function (data) {
  return this.client.post('/node', data)
}

node.delete = function (id) {
  var path = format('/node/%s', id)
  return this.client.delete(path)
}

node.deleteProperties = function (id, prop) {
  var path = format('/node/%s/properties', id)
  if (prop) {
    path = path + '/' + prop
  }
  return this.client.delete(path)
}
