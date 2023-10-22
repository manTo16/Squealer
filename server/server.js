const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()

//routes
const users = require('./routes/users')

const app=express()
const PORT = 5000

mongoose.connect(process.env.DATABASE_URL).then(()=>{
  console.log('connected to database')
})
const database=mongoose.connection
database.on('error',(error)=>console.error(error))

app.use(express.json())

app.use('/users',users)

app.get('/',(req,res)=>{
  res.status(200).send('Home page')
})

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})