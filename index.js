const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  }
}

const db = knex(knexConfig)

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

// GET endpoint
server.get('/api/zoos', (req, res) => {
  db('zoos')
  .then(zoos => {
    res.status(200).json(zoos)
  })
  .catch(error => {
    res.status(500).json(error)
  })
});

// POST endpoint
server.post('/api/zoos', (req, res) => {
  const changes = req.body;

  db.insert(changes)
  .into('zoos')
  .then(ids => {
    res.status(201).json(ids);
  })
  .catch(err => {
    res.status(500).json({ error: "There was an error while saving the zoo to the database." });
  })
})

// GET by id endpoint
server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .then(zoo => {
      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: 'zoo not found' });
      }
    });
});

// DELETE by id endpoint

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .del()
  .then(count => {
    if (count) {
      res.status(200).json(count)
    } else {
      res.status(404).json({ error: "Zoo not found" })
    }
  })
  .catch(err => res.status(500).json({ error: "The zoo could not be removed." }))
})

// PUT endpoint 

server.put('/api/zoos/:id', (req, res) => {
  const changes = req.body;

  db('zoos')
  .where({ id: req.params.id })
  .update(changes)
  .then(count => {
    res.status(200).json(count)
  })
  .catch(err => res.status(500).json({ error: "The zoo information could not be modified." }));
})







const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
 