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
    return200

}