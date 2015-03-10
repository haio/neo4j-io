var neo4j = require('..')()
var Node = neo4j.Node
var Label = neo4j.Label
var assert = require('assert')
var getObjectId = require('../lib/utils').getObjectId

describe('Label', function () {
  before(function () {
    var self = this

    return Node
      .create({name: 'test-label', key: 'this is key'})
      .then(function (node) {
        self.id = getObjectId(node)
      })
  })

  describe('#get', function () {
    it('should return all the labels of the node', function () {
      return Label
        .get(this.id)
        .then(function (labels) {
          assert.deepEqual(labels, [])
        })
    })
  })

  describe('#create', function () {
    it('should add a label to node', function () {
      var id = this.id
      return Label
        .create(id, 'NEO4JTEST')
        .then(function () {
          return Label
            .get(id)
            .then(function (labels) {
              assert.deepEqual(labels, ['NEO4JTEST'])
            })
        })
    })

    it('should support add multiple labels', function () {
      var id = this.id
      return Label
        .create(id, ['TESTLABEL', 'TESTLABEL1'])
        .then(function () {
          return Label
            .get(id)
            .then(function (labels) {
              assert.deepEqual(labels, ['NEO4JTEST', 'TESTLABEL', 'TESTLABEL1'])
            })
        })
    })
  })

  describe('#update', function () {
    it('should replace all old labels with new labels', function () {
      var id = this.id
      return Label
        .update(id, ['NEO4JTEST'])
        .then(function () {
          return Label
            .get(id)
            .then(function (labels) {
              assert.deepEqual(labels, ['NEO4JTEST'])
            })
        })
    })

    it('should support single label', function () {
      var id = this.id
      return Label
        .update(id, 'NEO4JTEST')
        .then(function () {
          return Label
            .get(id)
            .then(function (labels) {
              assert.deepEqual(labels, ['NEO4JTEST'])
            })
        })
    })
  })

  describe('#delete', function () {
    before(function () {
      return Label
        .create(this.id, 'TESTLABEL2')
    })

    it('should remove the specify label', function () {
      var id = this.id
      return Label
        .delete(id, 'TESTLABEL2')
        .then(function () {
          return Label
            .get(id)
            .then(function (labels) {
              assert.deepEqual(labels, ['NEO4JTEST'])
            })
        })
    })
  })

  describe('#nodes', function () {
    it('should return all nodes with the label', function () {
      return Label
        .nodes('NEO4JTEST')
        .then(function (nodes) {
          assert.equal(nodes.length > 0, true)
        })
    })
  })

  describe('#all', function () {
    it('should return all the labels', function () {
      return Label
        .all()
        .then(function (labels) {
          assert.equal(labels.length > 0, true)
        })
    })
  })

  after(function () {
    var cypher = 'MATCH (n:NEO4JTEST) OPTIONAL MATCH (n)-[r]-() DELETE n,r'
    return neo4j.query(cypher)
  })
})
