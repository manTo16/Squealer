const express = require('express')
const router = express.Router()
const User = require('../models/userModel')

router.get('/', async (req,res)=>{
  try{
    const allUsers = await User.find()
    res.json(allUsers)
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

router.post('/', async (req,res)=>{
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  })
  try{
    const newUser = await user.save()
    res.status(201).json(newUser)
  } catch(err){
    res.status(400).json({message: err.message})
  }
})

router.get('/:userName', async (req,res)=>{
  try{
    const oneUser = await User.findOne({username: req.params.userName})
    res.status(201).json(oneUser)
  }catch(err){
    res.status(400).json({message: err.message})
  }
})


router.patch('/:userName', async (req,res)=>{
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
})

router.delete('/:userName',async (req,res)=>{
  try{
    const deletedUser = await User.deleteOne({username: req.params.userName})
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User eliminated successfully' });
  }catch(err){
    res.status(500).json({message: err.message})
  }
})

module.exports = router
