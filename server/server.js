console.log("avvio server.js")
console.log("debug x14x")


const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
require('dotenv').config()

const path = require("path")


// *** modifiche fatte in produzione perchè a quanto pare non legge in .env

ENV_DATABASE_URL = "mongodb+srv://liambu:pepega@cluster0.5cpnjho.mongodb.net/?retryWrites=true&w=majority"
ENV_PORT = 8000
SECRET_KEY = "6F4jp16OZMRYrWmOYIDG"
// ***



//routes
const users = require('./routes/users')
const auth = require('./routes/auth')
const posts = require('./routes/posts')
const channels = require('./routes/channels')

const { startTimers } = require('./controllers/utils/externAPIChannels')

const app=express()
const PORT = ENV_PORT || 5000

mongoose.connect(ENV_DATABASE_URL).then(()=>{
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

in authController.js anche c'è un ENV_ al posto di process.env

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


app.get('/favicon.ico', async function(req, res) {
  res.sendFile(
    path.join(
      __dirname, "..", "app", "build", "favicon.ico"
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
//uguale a quello qua sopra ma per l'indirizzo /app senza barra dopo (/app/)
app.get("/app", async function(req, res) {
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






/* * * MOD * * */

app.get("/mod/", async function (req, res) {
  res.sendFile(
    path.join(__dirname, "..", "mod", "index.html"
    )
  )
})
app.get("/mod", async function (req, res) {
  res.sendFile(
    path.join(__dirname, "..", "mod", "index.html"
    )
  )
})

app.get("/mod/index", async function (req, res) {
  res.sendFile(
    path.join(__dirname, "..", "mod", "index.html"
    )
  )
})

app.get("/mod/users", async function (req, res) {
  res.sendFile(
    path.join(
      __dirname, "..", "mod", "users.html"
    )
  )
})

app.get("/mod/channels", async function (req, res) {
  res.sendFile(
    path.join(
      __dirname, "..", "mod", "channels.html"
    )
  )
})

app.get("/mod/squeals", async function (req, res) {
  res.sendFile(
    path.join(
      __dirname, "..", "mod", "squeals.html"
    )
  )
})

app.get("/mod/login", async function (req, res) {
  res.sendFile(
    path.join(
      __dirname, "..", "mod", "login.html"
    )
  )
})


app.use('/mod/js', 
        express.static(path.join(__dirname, "..", "mod", "js")))

app.use('/mod/css', 
        express.static(path.join(__dirname, "..", "mod", "css")))

app.use('/mod/assets', 
        express.static(path.join(__dirname, "..", "mod", "assets")))





/* * * DISAMBIGUA * * */
app.get('*', async function (req,res) {
  res.sendFile(
    path.join(
      __dirname, "..", "redirect", "index.html"
    )
  )
})




app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})




