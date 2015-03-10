var neo4j = require('..')()
var Relationship = neo4j.Relationship
var Node = neo4j.Node
var assert = require('assert')
var Promise = require('bluebird')
var getObjectId = require('../lib/utils').getObjectId

describe('Relationship', function () {
  before(function () {
    var nodes = [
      {name: 'n1'}, {name: 'n2'}
    ]
    var self = this

    return Promise
      .resolve(nodes)
      .map(function (node) {
        var cypher = 'CREATE (n:NEO4JTEST {node}) RETURN n'
        return neo4j
          .query(cypher, {node: node})
      })
      .then(function (nodes) {
        var nodeIds = nodes.map(function (n) {
          return getObjectId(n.data[0][0])
        })
        self.n1 = nodeIds[0]
        self.n2 = nodeIds[1]
        return true
      })
      .then(function () {
        return Relationship
          .create(self.n1, self.n2, 'before', {name: 'relationship'})
          .then(function (result) {
            self.id = getObjectId(result)
          })
      })
  })

  describe('#create', function () {
    it('should create relationship between two nodes', function () {
      var self = this
      return Relationship
        .create(this.n1, this.n2, 'HAS')
        .then(function (result) {
          var cypher = 'MATCH (n:NEO4JTEST)-[:HAS]->() RETURN n'
          return neo4j
            .query(cypher)
            .then(function (result) {
              assert.equal(result.data.length, 1)
            })
        })
    })

    it('should create relationship with data', function () {
      return Relationship
        .create(this.n1, this.n2, 'LIKE', {key: 'value'})
        .then(function () {
          var cypher = 'MATCH (n:NEO4JTEST)-[r:LIKE]->() RETURN r'
          return neo4j
            .query(cypher)
            .then(function (result) {
              var r = result.data[0][0].data
              assert.equal(r.key, 'value')
            })
        })
    })
  })

  describe('#get', function () {
    it('should return relationship of specify id', function () {
      return Relationship
        .get(this.id)
        .then(function (r) {
          assert.equal(r.data.name, 'relationship')
        })
    })
  })

  describe('#getProperties', function () {
    it('should return the propert(ies) of relationship', function () {
      return Relationship
        .getProperties(this.id)
        .then(function (r) {
          assert.equal(r.data.name, 'relationship')
        })
    })

    it('should return single property', function () {
      return Relationship
        .getProperties(this.id, 'name')
        .then(function (value) {
          assert.equal(value, 'relationship')
        })
    })
  })

  describe('#update', function () {
    it('should set all propertis on the relationship', function () {
      var id = this.id
      return Relationship
        .update(id, {age: 10, happy: true})
        .then(function () {
          return Relationship
            .get(id)
            .then(function (r) {
              assert.equal(r.data.age, 10)
              assert.equal(r.data.happy, true)
              assert(!r.data.name)
            })
        })
    })

    it('should set single property on the relationship', function () {
      var id = this.id
      return Relationship
        .update(id, 'name', 'new name')
        .then(function () {
          return Relationship
            .getProperties(id, 'name')
            .then(function (value) {
              assert.equal(value, 'new name')
            })
        })
    })
  })

  describe('#all', function () {
    it('should return all the relationships of the node', function () {
      return Relationship
        .all(this.n1)
        .then(function (rs) {
          assert(rs.length > 0)
        })
    })

    it('should return the relationships of the node and types', function () {
      return Relationship
        .all(this.n1, 'HAS')
        .then(function (rs) {
          assert(rs.length > 0)
        })
    })
  })

  describe('#incoming', function () {
    it('should return the incoming relationships of the node', function () {
      return Relationship
        .incoming(this.n1)
        .then(function (rs) {
          assert(rs.length === 0)
        })
    })
  })

  describe('#outgoing', function () {
    it('should return the outgoing relationships of the node', function () {
      return Relationship
        .outgoing(this.n1)
        .then(function (rs) {
          assert(rs.length > 0)
        })
    })
  })

  describe('#delete', function () {
    it('should delete the relationship', function () {
      var id = this.id
      return Relationship
        .delete(id)
        .then(function () {
          return Relationship
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
