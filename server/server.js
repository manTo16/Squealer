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


/*
differenze tra server produzione e questo:
c'è qualche app.get in più ma roba facilmente copiabile qua

lo script lì non legge il .env non si capisce perchè, quindi ci sono varie variabili dichiarate dentro 
i file chiamate ENV_NOMEVARIABILE ma piuttosto che tenere quelle conviene sistemare il problema del .env

*/

const User_tmp= require('./models/userModel'); // Assumendo che tu abbia un modello Mongoose chiamato User

async function updateImages() {
  // Ottieni tutti gli utenti
  const users = await User_tmp.find({});

  // Itera su ogni utente
  for (let user of users) {
    // Controlla se il campo userImage32x32 esiste e inizia con "data:image"
    if (user.userImage32x32 && !user.userImage32x32.startsWith('data:image')) {
      // Aggiungi "data:image/png;base64," all'inizio della stringa
      user.userImage32x32 = 'data:image/png;base64,' + user.userImage32x32;

      // Salva l'utente aggiornato nel database
      await user.save();
      console.log("utente ", user.username , " modificato")
    }
  }
}

// Chiama la funzione
updateImages();
console.log("funzione finita")

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




