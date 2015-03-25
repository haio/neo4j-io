var Client = require('./lib/client')
var Node = require('./lib/node')
var Label = require('./lib/label')
var Index = require('./lib/indexes')
var Relationship = require('./lib/relationship')

module.exports = function (url) {
  var client = new Client(url)
  var neo4j = {}

  neo4j.Node = new Node(client)
  neo4j.Relationship = new Relationship(client)
  neo4j.Label = new Label(client)
  neo4j.Index = new Index(client)
  neo4j.query = client.query.bind(client)
  neo4j.batch = function Batch () {
    var client = new Client(url, 'batch')

    return {
      Node: new Node(client),
      Relationship: new Relationship(client),
      Label: new Label(client),
      Index: new Index(client),
      exec: client.exec.bind(client),
      query: client.query.bind(client)
    }
  }

  return neo4j
}
