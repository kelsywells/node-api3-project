// code away
const express= require('express')
const helmet= require('helmet')
const server= require('./server')
const userRouter= require('./users/userRouter')
const postRouter= require('./posts/postRouter')


server.use(helmet())

server.use(express.json())


server.use('/users', userRouter)
server.use('/posts', postRouter)

server.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    })
})

server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Internal error occurred"
    })
})


server.listen(4000, () => {
    console.log("Server is running on port 4000...")
})