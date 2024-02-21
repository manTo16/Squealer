const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const { resizeBase64Image } = require('./utils/imageManipulation')

const { registrationDailyChars, registrationWeeklyChars, registrationMonthlyChars } = require('./utils/characterCountValues')

const ENV_SECRET_KEY = "6F4jp16OZMRYrWmOYIDG"


const register = async (req,res) => {
  const {username,email,displayName,password,userImage}=req.body;
  const isSmm = req.body.smm === true;
  const isPro = req.body.pro === true;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password,salt);
  const userThumbnail = await resizeBase64Image(userImage, 32, 32)
  const user = new User({
    username: username,
    email: email,
    displayName: displayName,
    userImage: userImage,
    userImage32x32: userThumbnail,
    password: hashedPassword,
    dailyChar: registrationDailyChars,
    weeklyChar: registrationWeeklyChars,
    monthlyChar: registrationMonthlyChars,
    smm: isSmm || false,
    pro: isPro || false
  })
  try{
    const newUser = await user.save()
    return res.status(201).json(newUser)
  } catch(err){
    return res.status(500).json({message: err.message})
  }
}

const login = async (req,res) =>{
  try{
    const {username,password, accountType}=req.body;
    const user = await User.findOne({username:username});
    if (!user) return res.status(400).json({message: "User not found"});
    const checkPW = await bcrypt.compare(password,user.password);
    if (!checkPW){
      console.log(username?? "?", "typed wrong password")
      return res.status(401).json({message:'Invalid credentials'})
    }
    const token = jwt.sign({id:user._id},ENV_SECRET_KEY,{expiresIn: '7d'});
    delete user.password;
    if (accountType !== "" && accountType==="mod") {
      if (!user.moderator) 
        console.log(username?? "?", "tried to log as a mod")
        return res.status(403).json({message: "you must be a moderator to log here"})
    }

    console.log(username?? "?", "logged in")
    return res.status(200).json({token,user})
  }catch(err){
    return res.status(500).json({message: err.message})
  }
}

module.exports = {
  register,
  login
}