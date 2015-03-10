var format = require('./utils').format

module.exports = Label

function Label (client) {
  this.client = client
}

var label = Label.prototype

label.create = function (nodeId, label) {
  var path = format('/node/%s/labels', nodeId)
  return this.client.post(path, label)
}

label.update = function (nodeId, label) {
  if (!Array.isArray(label)) {
    label = [label]
  }
  var path = format('/node/%s/labels', nodeId)
  return this.client.put(path, label)
}

label.get = function (nodeId) {
  var path = format('/node/%s/labels', nodeId)
  return this.client.get(path)
}

label.delete = function (nodeId, label) {
  var path = format('/node/%s/labels', nodeId)
  path = path + '/' + label
  return this.client.delete(path)
}

label.nodes = function (label) {
  var path = format('/label/%s/nodes', label)
  return this.client.get(path)
}

label.all = function () {
  return this.client.get('/labels')
}
