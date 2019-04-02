const router = require('express').Router();
const knex = require('knex'); 

const knexConfig = {
  client: 'sqlite3', // saying go into my node modules and find sqlite3
  useNullAsDefault: true, // you need this with sqlite3
  connection: {
    // anything you need to access the database like a key or something like that
    filename: './data/rolesDatabase.db3' // will always search like it's in the root
  }
}
const db = knex(knexConfig)

router.get('/', (req, res) => {
  // get the roles from the database
  db('roles') 
  .then(roles => 
    res.status(200)
    .json(roles))
  .catch(error => {
    res.status(500)
    .json({
      message: `Error! ${error}`
    })
  })
}); 

function getById(id) {
  return db('roles').where({ id: Number(id)})
}

router.get('/:id', (req, res) => {
  // retrieve a role by id
  getById(req.params.id)
  .then(role => {
    res.status(200)
    .json(role)
  }) 
  .catch(error => {
    res.status(500)
    .json({
      message: `Error! ${error}`
    })
  })
  
});

router.post('/', (req, res) => {
  // add a role to the database
  db('roles')
  .insert(req.body)
  .then(ids=> {
    const [id] = ids 
    db('roles')
    .where({id})
    .first()
    .then(role => {
      res.status(200)
      .json(role)
    })
  })
  .catch(error => {
    res.status(500)
    .json({
      message: `Error! ${error}`
    })
  })
});

router.put('/:id', (req, res) => {
  db('roles')
  .where({id: req.params.id})
  .update(req.body)
  .then(count => {
    if (count>0) {
      db('roles')
      .where({id: req.params.id})
      .first()
      .then(role => {
        res.status(200)
        .json(role)
      })
    } else {
      res.status(404)
      .json({ message: `Role not found so we couldn't update it`})
    }
  })
  .catch( error => {
    res.status(500)
    .json({ message: `Error! ${error}`})
  })
  
});

router.delete('/:id', (req, res) => {
  // remove roles (inactivate the role)
db('roles') 
.where({id: req.params.id})
.del()
.then(count => {
  if (count>0) {
    res.status(204)
    .json({
      message: `Role successfully deleted!`
    })
  } else {
    res.status(404)
    .json({
      message: `Couldn't delete the Role because we couldn't find it!`
    })
  }
}) 
.catch(error => {
  res.status(500)
  .json({
    message: `Error! ${error}`
  })
})
});

module.exports = router;
