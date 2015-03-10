var neo4j = require('..')()
var assert = require('assert')
var getObjectId = require('../lib/utils').getObjectId

describe('batch', function () {
  it('should support batch query', function () {
    var batch = neo4j.batch()
    var batchId = batch.Node.create({name: 'test-batch'})
    batch.Node.update({batch: batchId}, 'create_at', Date.now())
    batch.Label.create({batch: batchId}, 'NEO4JTEST')
    var newNodeId = batch.Node.create({name: 'test-batch-2'})
    batch.Relationship.create({batch: batchId}, {batch: newNodeId}, 'HAS')
    return batch
      .exec()
      .then(function (result) {
        var id = getObjectId(result[0].body)
        return neo4j
          .Node
          .get(id)
          .then(function (result) {
            // assert.deepEqual(result.metadata.labels, ['NEO4JTEST'])
            assert.equal(result.data.name, 'test-batch')
          })
      })
  })

  it('should support batch cypher', function () {
    var createCypher = 'CREATE (n:NEO4JTEST {node}) RETURN n'
    var getCypher = 'MATCH (n:NEO4JTEST) RETURN n'
    var batch = neo4j.batch()
    batch.query(createCypher, {node: {name: 'test-batch-cypher'}})
    batch.query(getCypher)

    return batch
      .exec()
      .then(function (results) {
        var nodes = results[1].body.data
        assert.equal(nodes.length, 2)
      })
  })
})

after(function () {
  var cypher = 'MATCH (n:NEO4JTEST) OPTIONAL MATCH (n)-[r]-() DELETE n,r'
  return neo4j.query(cypher)
})
