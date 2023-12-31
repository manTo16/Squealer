//const bcrypt = require('bcrypt')
const User = require('../models/userModel')

const getAllUsers = async (req,res)=>{
    try{
      const allUsers = await User.find()
      res.json(allUsers)
    }catch(err){
      res.status(500).json({message: err.message})
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
      res.status(201).json(oneUser)
    }catch(err){
      res.status(400).json({message: err.message})
    }
  }

const updateUser = async (req,res)=>{
    try{
      const userUpdates = req.body;
      const updatedUser = await User.updateOne({username: req.params.userName}, userUpdates)
      if (!updatedUser) {
        return res.status(404).json({ message: 'Oggetto non trovato' });
      }
      res.json(updatedUser);
    }catch(err){
      res.status(500).json({message: err.message})
    }
  }

const deleteUser = async (req,res)=>{
    try{
      const deletedUser = await User.deleteOne({username: req.params.userName})
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User eliminated successfully' });
    }catch(err){
      res.status(500).json({message: err.message})
    }
  }

const getUserPosts = async (req,res) => {
    try{
      const username = req.params.userName
      const post = Post.find({username})
      res.status(200).json(post)
    }catch(err){
      res.status(404).json({message: err.message})
    }
  }

const getUserChannels = async (req,res) =>{
  try{
    const username = req.params.userName
    const user = await User.findOne({username})
    const channelList = user.channels
    res.status(200).json(channelList)
  }catch(err){
    res.status(400).json({message: err.message})
  }
  
}
   

module.exports = {
    getAllUsers,
    //addNewUser,
    getUserPosts,
    getUser,
    updateUser,
    deleteUser,
    getUserChannels
}