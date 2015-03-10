var util = require('util')

exports.format = function (path, idOrBatchId) {
  return idOrBatchId.batch
    ? util.format(path.replace(/^\/\w+\/%s/, '{%s}'), idOrBatchId.batch)
    : util.format(path, idOrBatchId)
}
