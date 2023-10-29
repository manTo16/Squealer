const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()

//routes
const users = require('./routes/users')
const auth = require('./routes/auth')
const posts = require('./routes/posts')

const app=express()
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.DATABASE_URL).then(()=>{
  console.log('Connected to database')
})
const database=mongoose.connection
database.on('error',(error)=>console.error(error))

app.use(express.json())

app.use('/users',users)
app.use('/auth',auth)
app.use('/posts',posts)

app.get('/',(req,res)=>{
  res.status(200).send('Home page')
})

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})