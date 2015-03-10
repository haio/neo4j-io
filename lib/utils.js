var util = require('util')

exports.format = function (path, idOrBatchId) {
  return idOrBatchId.batch
    ? util.format(path.replace(/^\/\w+\/%s/, '{%s}'), idOrBatchId.batch)
    : util.format(path, idOrBatchId)
}

exports.getObjectId = function (obj) {
  // Old version of Neo4j doesn't support metadata
  return obj.metadata
    ? obj.metadata.id
    : obj.self.split('/').pop()
}
