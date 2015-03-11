var neo4j = require('..')()
var Node = neo4j.Node
var assert = require('assert')
var getObjectId = require('../lib/utils').getObjectId

describe('Node', function () {
  before(function () {
    var cypher = 'CREATE (n:NEO4JTEST {node}) RETURN n'
    var node = { name: 'test'+Date.now(), firstname: 'neo4j' }
    var self = this
    return neo4j
      .query(cypher, {node: node})
      .then(function (n) {
        self.id = getObjectId(n.data[0][0])
      })
  })

  describe('create', function () {
    it('should create a new node', function () {
      return Node.create({name: 'hello node'})
    })
  })

  describe('get', function () {
    it('should get node of specify id', function () {
      return Node.get(this.id)
    })
  })

  describe('update', function () {
    it('should update the property of node', function () {
      var id = this.id
      return Node
        .update(id, 'type', 'test')
        .then(function () {
          return Node
            .get(id)
            .then(function (n) {
              assert.equal(n.data.type, 'test')
            })
        })
    })

    it('should replace all properties', function () {
      var id = this.id
      return Node
        .update(id, {is: 'neo4j', age: 10})
        .then(function () {
          return Node
            .get(id)
            .then(function (n) {
              assert.equal(Object.keys(n.data).length, 2)
              assert(n.data.is)
              assert(n.data.age)
            })
        })
    })
  })

  describe('#deleteProperties', function () {
    it('should delete specify property', function () {
      var id = this.id
      return Node
        .deleteProperties(id, 'is')
        .then(function () {
          return Node
            .get(id)
            .then(function (n) {
              assert.deepEqual(Object.keys(n.data), ['age'])
            })
        })
    })

    it('should delete all properties', function () {
      var id = this.id
      return Node
        .deleteProperties(id)
        .then(function () {
          return Node
            .get(id)
            .then(function (n) {
              assert.deepEqual(Object.keys(n.data), [])
            })
        })
    })
  })

  describe('#delete', function () {
    it('should delete the node', function () {
      var id = this.id
      return Node
        .delete(id)
        .then(function () {
          return Node
            .get(id)
            .catch(function (err) {
              assert.equal(err.status, 404)
            })
        })
    })
  })

  after(function () {
    var cypher = 'MATCH (n:NEO4JTEST) OPTIONAL MATCH (n)-[r]-() DELETE n,r'
    return neo4j.query(cypher)
  })
})
