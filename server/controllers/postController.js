const User = require('../models/userModel')
const Post = require('../models/postModel')

const createPost = async (req,res) => {
  try{
    const {userId, text} = req.body;
    const user = User.findById(userId);
    const newPost = new Post({
      userId,
      text,
      username: user.username,
      displayName: user.displayName
    })
    await newPost.save();
    const post = await Post.find();
    res.status(200).json(post);
  }catch(err){
    res.status(409).json({message: err.message})
  }
}

const getFeed = async (req,res) => {
  try{
    const post = await Post.find();
    res.status(200).json(post);
  }catch(err){
    res.status(500).json({message: err.message})
  }
}

const getPost = async (req,res) => {
  try{
    const post = Post.findById(req.params.id)
    res.status(200).json(post)
  }catch(err){
    res.status(404).json({message: err.message})
  }
}


module.exports = {
  createPost,
  getFeed,
  getPost,
}