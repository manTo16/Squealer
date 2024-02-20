const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()

const path = require("path")

//routes
const users = require('./routes/users')
const auth = require('./routes/auth')
const posts = require('./routes/posts')
const channels = require('./routes/channels')

const { startTimers } = require('./controllers/utils/externAPIChannels')

const app=express()
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.DATABASE_URL).then(()=>{
  console.log('Connected to database')
})
const database=mongoose.connection
database.on('error',(error)=>console.error(error))

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors())

app.use('/users',users)
app.use('/auth',auth)
app.use('/posts',posts)
app.use('/channels',channels)


console.log("[starting] automatic posts timers...")
startTimers()
console.log("[started] automatic posts timers")


/*
differenze tra server produzione e questo:
c'è qualche app.get in più ma roba facilmente copiabile qua

lo script lì non legge il .env non si capisce perchè, quindi ci sono varie variabili dichiarate dentro 
i file chiamate ENV_NOMEVARIABILE ma piuttosto che tenere quelle conviene sistemare il problema del .env

*/


app.use('/app/static', 
        express.static(path.join(__dirname, "..", "app", "build",'static')))

//PERCHÈ???? PERCHÈ???? PERCHÈ DEVO SPECIFICARE QUESTO MA CHE CAZZO DOVREBBE FUNZIONARE CON L'APP.USE QUA SOPRA
//comunque vabe' così funziona non ho altro da aggiungere
app.get('/app/static/css/main.0a02f0a4.css',async function(req, res) {
  res.sendFile(
    path.join(
      __dirname, "..", "app", "build", "static", "css", "main.0a02f0a4.css"
    )
  )
})

app.get('/app/favicon.ico',async function(req, res) {
  res.sendFile(
    path.join(
      __dirname, "..", "app", "build", "favicon.ico"
    )
  )
})

app.get("/app/*", async function(req, res) {
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "app",
      "build",
      "index.html"
    )
  )
})

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})




