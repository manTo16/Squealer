//const bcrypt = require('bcrypt')
const User = require('../models/userModel')

const getAllUsers = async (req,res)=>{
    try{
      const allUsers = await User.find()
      return res.json(allUsers)
    }catch(err){
      return res.status(500).json({message: err.message})
    }
  }
 
/* const addNewUser = async (req,res)=>{
    const hashedPassword = await bcrypt.hash(req.body.password,10)
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      displayName: req.body.displayName,
      password: hashedPassword 
    })
    try{
      const newUser = await user.save()
      res.status(201).json(newUser)
    } catch(err){
      res.status(400).json({message: err.message})
    }
  } */

const getUser = async (req,res)=>{
    try{
      const oneUser = await User.findOne({username: req.params.userName})
      delete oneUser.password
      return res.status(201).json(oneUser)
    }catch(err){
      return res.status(400).json({message: err.message})
    }
  }

const updateUser = async (req,res)=>{
    try{
      const userUpdates = req.body;
      const updatedUser = await User.updateOne({username: req.params.userName}, userUpdates)
      if (!updatedUser) {
        return res.status(404).json({ message: 'Oggetto non trovato' });
      }
      return res.json(updatedUser);
    }catch(err){
      return res.status(500).json({message: err.message})
    }
  }

const deleteUser = async (req,res)=>{
    try{
      const deletedUser = await User.deleteOne({username: req.params.userName})
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ message: 'User eliminated successfully' });
    }catch(err){
      return res.status(500).json({message: err.message})
    }
  }

const getUserPosts = async (req,res) => {
    try{
      const username = req.params.userName
      const post = Post.find({username})
      return res.status(200).json(post)
    }catch(err){
      return res.status(404).json({message: err.message})
    }
  }


/*
questa qui mi ha mandato un errore 500 non ho capito perchè
almeno credo fosse questa? era un axios error e c'era l'url di quest'api nel responseURL
ah ok trovato 

il jwt expired mi sembra lo dia tipo dopo un'oretta circa
quindi o lo togliamo oppure almeno dobbiamo trovare il modo di fare il catch e rimandare alla pagina di login

readyState: 4
response: '{"message":"jwt expired"}'
responseText: '{"message":"jwt expired"}'
responseType: ""
responseURL: "http://localhost:3001/users/liamilmagnifico/channels"
responseXML: null
status: 500
statusText: "Internal Server Error"
timeout: 0
*/
const getUserChannels = async (req,res) =>{
  try{
    const username = req.params.userName
    const user = await User.findOne({username})
    const channelList = user.channels
    return res.status(200).json(channelList)
  }catch(err){
    return res.status(400).json({message: err.message})
  }
  
}

const getUserImpressions = async (req,res) => {
  try {
    username = req.params.userName
    const user = await User.findOne({username: username})
    if(!user) return res.status(404).json({message: "user not found"})

    const response = user.impressedPostIds
    return res.status(200).json(response)
  }
  catch(err) {
    return res.status(500).json({message: err.message})
  }
}

const getUserImpressionsVeryLikes = async (req,res) => {
  try {
    username = req.params.userName
    const user = await User.findOne({username: username})
    if(!user) return res.status(404).json({message: "user not found"})

    const response = user.impressedPostIds.veryLikes
    return res.status(200).json(response)
  }
  catch(err) {
    return res.status(500).json({message: err.message})
  }
}

const getUserImpressionsLikes = async (req,res) => {
  try {
    username = req.params.userName
    const user = await User.findOne({username: username})
    if(!user) return res.status(404).json({message: "user not found"})

    const response = user.impressedPostIds.likes
    return res.status(200).json(response)
  }
  catch(err) {
    return res.status(500).json({message: err.message})
  }
}

const getUserImpressionsDislikes = async (req,res) => {
  try {
    username = req.params.userName
    const user = await User.findOne({username: username})
    if(!user) return res.status(404).json({message: "user not found"})

    const response = user.impressedPostIds.dislikes
    return res.status(200).json(response)
  }
  catch(err) {
    return res.status(500).json({message: err.message})
  }
}

const getUserImpressionsVeryDislikes = async (req,res) => {
  try {
    username = req.params.userName
    const user = await User.findOne({username: username})
    if(!user) return res.status(404).json({message: "user not found"})

    const response = user.impressedPostIds.veryDislikes
    return res.status(200).json(response)
  }
  catch(err) {
    return res.status(500).json({message: err.message})
  }
}

const getUserImpressionsViews = async (req,res) => {
  try {
    username = req.params.userName
    const user = await User.findOne({username: username})
    if(!user) return res.status(404).json({message: "user not found"})

    const response = user.impressedPostIds.views
    return res.status(200).json(response)
  }
  catch(err) {
    return res.status(500).json({message: err.message})
  }
}

//modo pigro per evitare un errorino
const return200 = async (req,res) => {
  return res.status(200)
}

const getUserImage = async (req,res) => {
  try {
    //console.log("entro in getUserImage")
    username = req.params.userName
    //console.log("getUserImage username: ", username)
    const user = await User.findOne({username: username})
    if(!user) return res.status(404).json({message: "user not found"})
    
    const response = user.userImage
    return res.status(200).json(response)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}   

/*
ritorna gli username.
non so bene come fare.
per ora l'idea è che ritorna l'username e poi il frontend fa altre richieste
per prendere tutti i dati di ciascun utente, come facciamo col post

oppure si potrebbe fare che qua ritorna username e display name e il frontend 
fa un controllino per prendere solo la parte di array che gli interessa
diciamo se vediamo che ci troviamo a fare richieste che prendono tutti i dati
di un utente per poi usare solo il display name allora magari facciamo così
*/
const searchUserByDisplayName = async (req,res) => {
  try {
    const query = req.params.name

    const users = await User.find({ displayName: { $regex: new RegExp(query, 'i') }}, 'username -_id')
    usernames = users.map(user => user.username)

    return res.status(200).json(usernames)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const searchUserByUsername = async (req,res) => {
  try {
    const query = req.params.name

    const users = await User.find({ username: { $regex: new RegExp(query, 'i') }}, 'username -_id')
    usernames = users.map(user => user.username)

    return res.status(200).json(usernames)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const searchUserByDisplayNameOneResult = async (req,res) => {
  try {
    const query = req.params.name

    const user = await User.findOne({ displayName: { $regex: new RegExp(query, 'i') }}, 'username -_id')

    return res.status(200).json(user ? [user.username] : [])
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const searchUserByUsernameOneResult = async (req,res) => {
  try {
    const query = req.params.name

    const user = await User.findOne({ username: { $regex: new RegExp(query, 'i') }}, 'username -_id')

    return res.status(200).json(user ? [user.username] : [])
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

//questa è pensata per la moderator dashboard
const setUserCharacters = async (req,res) => {
  try {
    const username = req.params.userName
    const { daily, weekly, monthly } = req.body

    const user = await User.findOne({username: username})

    if (!user) return res.status(404).json({message: "user not found"})

    user.dailyChar = daily < 0 ? user.dailyChar : daily
    user.weeklyChar = weekly < 0 ? user.weeklyChar : weekly
    user.monthlyChar = monthly < 0 ? user.monthlyChar : monthly

    await user.save()

    return res.status(200)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const updateUserCharacters = async (req,res) => {
  try {
    const username = req.params.userName
    const { daily, weekly, monthly } = req.body

    const user = await User.findOne({username: username})

    if (!user) return res.status(404).json({message: "user not found"})

    if (user.debtChar === 0) {
      user.dailyChar += daily
      user.weeklyChar += weekly
      user.monthlyChar += monthly

      if (Math.min(user.dailyChar, user.weeklyChar, user.monthlyChar) < 0) 
        user.debtChar = -Math.min(user.dailyChar, user.weeklyChar, user.monthlyChar)
      if (user.dailyChar < 0) user.dailyChar = 0
      if (user.weeklyChar < 0) user.weeklyChar = 0
      if (user.monthlyChar < 0) user.monthlyChar = 0
    }

    else {
      /* ALLORA
      pensandoci ha più senso fare che la update ha un unico elemento nel body della richiesta e tutti i contatori
      di caratteri vengono aumentati dello stesso valore. però sarebbe da pensare. per sicurezza per ora lascio con 3 cosi
      al massimo ne mettiamo uno unico
      */
      user.debtChar -= daily
    }

    

    await user.save()
    console.log("updateUserCharacters utente SALVATO")
    return res.status(200).json({daily: user.dailyChar, weekly: user.weeklyChar, monthly: user.monthlyChar})
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const getUserDebt = async (req,res) => {
  try {
    const username = req.params.userName

    const user = await User.findOne({username: username})

    if (!user) return res.status(404).json({message: "user not found"})

    const debt = user.debtChar

    return res.status(200).json(debt)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

module.exports = {
    getAllUsers,
    //addNewUser,
    getUserPosts,
    getUser,
    updateUser,
    deleteUser,
    getUserChannels,
    getUserImpressions,
    getUserImpressionsVeryLikes,
    getUserImpressionsLikes,
    getUserImpressionsDislikes,
    getUserImpressionsVeryDislikes,
    getUserImpressionsViews,
    return200,
    getUserImage,
    searchUserByDisplayName,
    searchUserByUsername,
    searchUserByDisplayNameOneResult,
    searchUserByUsernameOneResult,
    setUserCharacters,
    updateUserCharacters,
    getUserDebt
}