const express = require('express');
const posts= require('./postDb')
const router = express.Router();

router.get('/', (req, res) => {
  posts.get()
  .then(post => {
      res.json(post);
  })
  .catch( err => {
      res.status(500).json({
          message: "Could not retrieve posts."
      })
  }
  )
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  posts.get(id)
      .then(post => {
          res.json(post)
      })
      .catch( err=> {
          res.status(500).json({
              message: "Could not retrieve this post."
          })
      }
      )

});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  posts.remove(id)
      .then(deleted => {
          if (!deleted){
              res.status(404).json({
                  error: "Post could not be found."
              })
          }
          else{
              res.status(200).json({
                  message: "Post deleted!"
              })
          }
      })
      .catch(err => {
          res.status(500).json({
              message: "Post could not be removed."
          })
      })

});

router.put('/:id', (req, res) => {
  const { id } = req.params;

  posts.update(id)
  .then(updated => {
      res.json(updated)
      }
  )
  .catch(err => {
      res.json({
          message: "Post could not be updated."
      })
  })
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;

  posts.getById(id)
  .then(postId => {
    next()
  })
  .catch(err => {
    console.log("error:", err)
    res.status(400).json({
      message: "Invalid ID. Please try again."
    })
  })
}

module.exports = router;
