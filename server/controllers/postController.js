const User = require('../models/userModel')
const Post = require('../models/postModel')

//poi magari spostiamo la funzione in un altro file che includiamo qua
const checkReceiverSyntax = (receiver) => {
  if (receiver != "") {
    if ( (receiver[0] == "@") || (receiver[0] == "$") ) {
      return true;
    }
  }
  return false;
}



const createPost = async (req,res) => {
  try{
    const {userId, text, receivers} = req.body;
    const user = await User.findOne({_id: userId});

    //rimuovi elementi vuoti dall'array dei destinatari
    const receiversCopy = receivers.filter(checkReceiverSyntax);

    const newPost = new Post({
      userId: userId,
      username: user.username,
      displayName: user.displayName,
      text: text,
      receivers: receiversCopy,
    })
    //res.status(400).json({message: JSON.stringify(user.username) })
    await newPost.save();
    res.status(200).json({message: "post created"});
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

const getFeedIds = async (req,res) => {
  try {
    /*
    TODO: fare in modo che vengano presi solo un determinato numero di post dal database
    in teoria le get non dovrebbero prendere nulla nelle richieste
    https://stackoverflow.com/questions/978061/http-get-with-request-body
    quindi va fatto in altro modo
    per ora ho risolto in questo modo un po' statico
    va bene ma se vi vengono nuove idee per scegliere quel numero in modo un po' più dinamico potrebbe essere carino
    */
    //numberOfPosts = req.body.numberOfPosts;
    numberOfPosts = 5;
   
    const postIds = await Post.find({}, {projection:{_id:true}}).sort({creationDate: -1}).limit(numberOfPosts);
    res.status(200).json(postIds);
    
  }
  catch (err) {
    res.status(500).json({message: err.message});
  }
}

const getPost = async (req,res) => {
  try{
    const post = await Post.findOne({_id: req.params.id})
    res.status(200).json(post)
  }catch(err){
    res.status(404).json({message: err.message})
  }
}

const updateImpressions = async (req,res) =>{
  try{
    const post = await Post.findOne({_id: req.params.id})
    if (!post) res.status(404).json({message: "post not found"})
    const impression = req.params.impression
    switch(impression){
      case 'like':
        post.impressions.likes+=1
        break
      case 'dislike':
        post.impressions.dislikes+=1
        break
      case 'view':
        post.impressions.views+=1
        break
    }
    await post.save()
    res.status(200).json(post)
  }
  catch(err){
    res.status(500).json({message: err.message});
  }
}


module.exports = {
  createPost,
  getFeed,
  getFeedIds,
  getPost,
  updateImpressions
}