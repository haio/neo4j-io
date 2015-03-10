var format = require('./utils').format

module.exports = Relationship

function Relationship (client) {
  this.client = client
}

var relationship = Relationship.prototype

relationship.get = function (id) {
  var path = format('/relationship/%s', id)
  return this.client.get(path)
}

relationship.create = function (from, to, type, props) {
  var path = format('/node/%s/relationships', from)
  to = format('/node/%s', to)
  var data = {
    to: to,
    type: type
  }

  if (props) {
    data.data = props
  }

  return this.client.post(path, data)
}

relationship.getProperties = function (id, prop) {
  var path = format('/relationship/%s', id)

  if (prop) {
    path = path + '/properties/' + prop
  }
  return this.client.get(path)
}

relationship.update = function (id, prop, value) {
  var path = format('/relationship/%s/properties', id)
  if (typeof prop === 'string') {
    path = path + '/' + prop
    prop = value
  }
  return this.client.put(path, prop)
}

relationship.delete = function (id) {
  var path = format('/relationship/%s', id)
  return this.client.delete(path)
}

relationship.all = function (nodeId, types) {
  var path = format('/node/%s/relationships/all', nodeId)
  if (types) {
    path = path + '/' + types
  }
  return this.client.get(path)
}

relationship.outgoing = function (nodeId) {
  var path = format('/node/%s/relationships/out', nodeId)
  return this.client.get(path)
}

relationship.incoming = function (nodeId) {
  var path = format('/node/%s/relationships/in', nodeId)
  return this.client.get(path)
}
