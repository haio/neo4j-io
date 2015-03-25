var neo4j = require('..')()
var Index = neo4j.Index
var assert = require('assert')

describe('Index', function () {
  describe('#create', function () {
    it('should create a index on given label', function () {
      return Index
        .create('NEO4JTEST', 'name')
    })
  })

  describe('#get', function () {
    it('should return indexes on the label', function () {
      return Index
        .get('NEO4JTEST')
        .then(function (result) {
          var indexes = result[0].property_keys
          assert.deepEqual(indexes, ['name'])
        })
    })
  })

  describe('#delete', function () {
    it('delete the index', function () {
      return Index
        .delete('NEO4JTEST', 'name')
        .then(function () {
          return Index
            .get('NEO4JTEST')
            .then(function (result) {
              assert.deepEqual(result, [])
            })
        })
    })
  })

  after(function () {
    var cypher = 'MATCH (n:NEO4JTEST) OPTIONAL MATCH (n)-[r]-() DELETE n,r'
    return neo4j.query(cypher)
  })
})
