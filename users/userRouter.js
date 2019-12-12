const express = require('express');
const users= require('./userDb.js')
const posts= require('../posts/postDb.js')
const router = express.Router();

router.post('/', (req, res) => {
  const { name } = req.body;

  users.insert(name)
  .then(
    res.json(name)
  )
  .catch(err=> {
    res.status(500).json({
      message: "Could not create user at this time"
    })
  })
});

router.post('/:id/posts', (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  const user_id = id;

  posts.insert({user_id, text})
  .then(posts => 
    res.status(201).json(posts)
    )

  .catch(err => {
    res.status(500).json({
      message: 'Could not add post'
    })
  })

});

router.get('/', (req, res) => {
    users.get()
    .then(Users => {
      res.json(Users);
    })
    .catch(err => {
      res.status(500).json({
        message: "Could not retrieve users"
      })
    })
  });

router.get('/:id', (req, res) => {
  const { id } = req.params;
  users.get(id)
  .then(user => {
    res.json(user)
  })
  .catch(err=> {
    res.status(500).json({
      message: "Could not retrieve user"
    })
  })
});

router.get('/:id/posts', (req, res) => {
  const { id } = req.params;
  posts.get(id)
  .then(user=> {
    if(!user) {
      res.status(404).json({
        error: "Could not find this user"
      })
    } else {
      res.json(user)
    }
  })
  .catch(err => {
    res.status(500).json({ 
      message: "Could not retrieve post"
    })
  })
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  user.remove(id)
  .then(deleted => {
    if(!deleted){
      res.status(404).json({
        error: "User does not exist"
      })
    } else {
      res.status(200).json({
        message: "User was removed."
      })
    }
  })
  .catch(err => {
    res.status(500).json({
      error: "Could not remove user."
    })
  })
});

router.put('/:id', (req, res) => {
  const { id } = req.params;

  users.update(id)
  .then(updated=> {
    res.json(updated)
  })
  .catch(err=> {
    res.json({
      error: "Could not update."
    })
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params

  users.getById(id)
      .then (userId => {
          if(userId) {
              next();
              
          } else {
              res.status(400).json({
                  message: "invalid user ID"
              })
          }
      })
      .catch (err => {
          console.log("error:", err)
      })


}

function validateUser(req, res, next) {
  const { name, body } = req.body;

  users.get
  .then(user => {
    if(!name) {
      res.status(400).json({
        message:"Please include a name"
      })
    } else {
      if(!body){
        res.status(400).json({
          message: "Please fill in user info"
        })
      } else {
        next()
    } 
    }
  })

}

function validatePost(req, res, next) {
    const { text, body } = req.body;

    posts.get
    .then(post => {
      if (!body) {
        res.status(400).json({
          message: "Please include post info"
        })
      } else {
        if (!text) {
          res.status(400).json({
            message: "Please include text"
          })
        }
      }
    })
}

module.exports = router;
