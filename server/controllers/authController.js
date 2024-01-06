const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const register = async (req,res) => {
  const {username,email,displayName,password,userImage}=req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password,salt);
  const user = new User({
    username,
    email,
    displayName,
    userImage,
    password: hashedPassword
  })
  try{
    const newUser = await user.save()
    return res.status(201).json(newUser)
  } catch(err){
    return res.status(400).json({message: err.message})
  }
}

const login = async (req,res) =>{
  try{
    const {username,password}=req.body;
    const user = await User.findOne({username:username});
    if (!user) return res.status(400).json({message: "User not fount"});
    const checkPW = await bcrypt.compare(password,user.password);
    const token = jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn: '7d'});
    delete user.password;
    return res.status(200).json({token,user})
  }catch(err){
    return res.status(400).json({message: err.message})
  }
}

module.exports = {
  register,
  login
}