module.exports = Index

function Index (client) {
  this.client = client
}

var index = Index.prototype

index.get = function (label) {
  var path = '/schema/index/' + label
  return this.client.get(path)
}

index.create = function (label, index) {
  var path = '/schema/index/' + label
  var data = {
    property_keys: [index]
  }
  return this.client.post(path, data)
}

index.drop =
index.delete = function (label, index) {
  var path = '/schema/index/' + label + '/' + index
  return this.client.delete(path)
}
