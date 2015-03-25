# Neo4j API Wrapper

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

[npm-image]: https://img.shields.io/npm/v/neo4j-io.svg?style=flat
[npm-url]: https://npmjs.org/package/neo4j-io
[travis-image]: https://img.shields.io/travis/haio/neo4j-io.svg?style=flat
[travis-url]: https://travis-ci.org/haio/neo4j-io
[coveralls-image]: https://img.shields.io/coveralls/haio/neo4j-io.svg?style=flat
[coveralls-url]: https://coveralls.io/r/haio/neo4j-io?branch=master

Yet another Neo4j [REST API](http://neo4j.com/docs/stable/rest-api.html) wrapper for io.js, which provides Promise api.

## Usage

```sh
npm install neo4j-io --save

var neo4j = require('neo4j-io')([url])
```

## API

### Cypher

```js
var cypher = 'MATCH (n:NODE) RETURN n LIMIT 1'
neo4j
  .query(cypher)
  .then()
  .catch()

// With params
var cypher = 'MATCH (n:NODE) WHERE n.name={name} RETURN n'
var params = { name: 'neo4j' }
neo4j.query(cypher, params)
```

### Node

#### create(node)

Create a node with JSON data

```js
neo4j.Node.create({ name: 'name' })
```

#### get(id)

Get node with specify id

```js
neo4j.Node.get(1)
```

#### update(id, prop, [value])

When prop is a string, it will update the specify property, otherwise reset node
with given json

```js
// Update name
neo4j.Node.update(1, 'name', 'new name')

// Reset node
neo4j.Node.update(1, {age: 10})
```

#### delete(id)

Delete node

```js
neo4j.Node.delete(1)
```

#### deleteProperties(id, [prop])

Delete one or all properties

```js
neo4j.Node.deleteProperties(1, 'name')
neo4j.Node.deleteProperties(1)
```

### Relationship

#### create(from, to, type, [props])

Create a relationship between two nodes with specify type

```js
neo4j.Relationship.create(1, 2, 'LIKES')
neo4j.Relationship.create(1, 2, 'LIKES', {really: true})
```

#### get(id)

Get a relationship node

#### getProperties(id, [prop])

Get properties

#### update(id, prop, [value])

Update or reset properties

#### delete(id)

Delete a relationship

#### all(nodeId)

Get all relationships of the node

#### incoming(nodeId)

Get incoming relationships of the node

#### outgoing(nodeId)

Get outgoing relationships of the node

### Label

#### craete(nodeId, label)

Add label to node

#### update(nodeId, labels)

Update labels of the node

```js
neo4j.Label.update(1, 'NODE')
neo4j.Label.update(1, ['NODE', 'BOOK'])
```

#### get(nodeId)

Get labels of the node

#### delete(nodeId, label)

#### nodes(label)

Get all the nodes with label

#### all()

Get all the labels

### Index

#### get(label)

Get indexes for a label

#### create(label, index)

Create a index for a label

```js
neo4j.Index.create('label', 'index')
```

#### delete|drop(label, index)

Drop index

### Batch

All the api above are available in batch operation, `exec` must be called when you want
to send the requests

```js
var batch = neo4j.batch()
// Create a node
var batchId = batch.Node.create({name: 'batch'})
// Add a label to node, use id or batch Id
batch.Label.create({batch: batchId}, 'NODE')
// Create a relationship
batch.Relationship.create({batch: batchId}, 2, 'LIKE')
// Call exec
batch.exec().then()

// Batch also support cypher

var c1 = 'START n=node(1) RETURN n'
var c2 = 'MATCH (n:NODE) WHERE n.name={name} RETURN n'

batch.query(c1)
batch.query(c2, {name: 'test'})
batch.exec().then()
```

## LICENSE

MIT
