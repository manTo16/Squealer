const User = require('../models/userModel')
const Post = require('../models/postModel')
const Channel = require('../models/channelModel')

const { checkReceiverSyntax, parseTextForMentions } = require('./utils/postUtils')

//poi magari spostiamo la funzione in un altro file che includiamo qua



const createPost = async (req,res) => {
  try{
    const {userId, text, receivers} = req.body;
    const user = await User.findOne({_id: userId});

    //rimuovi elementi vuoti dall'array dei destinatari
    console.log("createPost receivers: ", receivers)
    const receiversCopy = receivers.filter(checkReceiverSyntax);

    receiversCopy.map((receiver) => console.log("receiver: ", receiver))
    /* prendi menzioni dal testo del post */
    const mentions = parseTextForMentions(text)
    console.log("createPost mentions: ", mentions)

    const newPost = new Post({
      postId: "",
      userId: userId,
      username: user.username,
      displayName: user.displayName,
      text: text,
      receivers: receiversCopy,
      mentions: mentions
    })
    //res.status(400).json({message: JSON.stringify(user.username) })
    await newPost.save();

    /* aggiungi il post ai canali ai quali è destinato */
    receiversCopy.filter(receiver => receiver[0] === "§").map(async (receiver) => {
      console.log("createPost filter map receiver: ", receiver)      
      let channel = await Channel.findOne({channelName: receiver.slice(1)})
      console.log("createPost filter map channel._id: ", channel?._id)
      if(channel) {
        console.log("createPost sono dentro l'if")
        console.log("createPost channel: ", channel)
        console.log("createPost newPost._id: ", newPost._id)
        channel.postsIds.push(newPost._id)
        await channel.save()
      }
    })


    return res.status(200).json(newPost.postId);
  }catch(err){
    return res.status(409).json({message: err.message})
  }
}

const getFeed = async (req,res) => {
  try{
    const post = await Post.find();
    return res.status(200).json(post);
  }catch(err){
    return res.status(500).json({message: err.message})
  }
}

const getFeedIds = async (req,res) => {
  try {
    numberOfPosts = 10;
   
    const postIds = await Post.find({}, {projection:{_id:true}}).sort({creationDate: -1}).limit(numberOfPosts);
    return res.status(200).json(postIds);
    
  }
  catch (err) {
    return res.status(500).json({message: err.message});
  }
}

const getPost = async (req,res) => {
  try{
    const post = await Post.findOne({_id: req.params.id})
    //console.log("getPost: ", post)
    return res.status(200).json(post)
  }catch(err){
    return res.status(404).json({message: err.message})
  }
}

const updateImpressions = async (req,res) => {
  try{
    const postId = req.params.id
    const post = await Post.findOne({_id: postId})
    if (!post) 
      return res.status(404).json({message: "post not found"})

    const impression = req.params.impression

    const {username} = req.body
    const user = await User.findOne({username: username})
    if ((!user) && (username != "guestUser")) 
      return res.status(404).json({message: "user not found"})
    //console.log("updateImpressions: \n\tpostId: ", postId, "\n\timpression: ", impression, "\n\tusername: ", username)

    switch(impression){
      case 'veryLike':
        /* adds user chosen reaction */
        if (!post.impressions.veryLikes.usernames.includes(username)) {
          post.impressions.veryLikes.number+=1
          post.impressions.veryLikes.usernames.push(username)
        }
        /* remove user other reactions */
        if (post.impressions.likes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.likes.usernames": username } });
          post.impressions.likes.number-=1
        }
        if (post.impressions.dislikes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.dislikes.usernames": username } });
          post.impressions.dislikes.number-=1
        }
        if (post.impressions.veryDislikes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.veryDislikes.usernames": username } });
          post.impressions.veryDislikes.number-=1
        }
        /* aggiunge il post alla lista dell'utente, se non c'è già */
        if (user && !user.impressedPostIds.veryLikes.includes(postId)) {
          user.impressedPostIds.veryLikes.push(postId)
          /* toglie il post dalla lista dell'utente, nel caso ci sia */
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.likes": postId} })
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.dislikes": postId} })
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.veryDislikes": postId} })
        }
        break

      case 'like':
        /* adds user chosen reaction */
        if (!post.impressions.likes.usernames.includes(username)) {
          post.impressions.likes.number+=1
          post.impressions.likes.usernames.push(username)
        }
        /* remove user other reactions */
        if (post.impressions.veryLikes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.veryLikes.usernames": username } });
          post.impressions.veryLikes.number-=1
        }
        if (post.impressions.dislikes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.dislikes.usernames": username } });
          post.impressions.dislikes.number-=1
        }
        if (post.impressions.veryDislikes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.veryDislikes.usernames": username } });
          post.impressions.veryDislikes.number-=1
        }
        /* aggiunge il post alla lista dell'utente, se non c'è già*/
        if (user && !user.impressedPostIds.likes.includes(postId)) {
          user.impressedPostIds.likes.push(postId)
          /* toglie il post dalla lista dell'utente, nel caso ci sia */
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.veryLikes": postId} })
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.dislikes": postId} })
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.veryDislikes": postId} })
        }
        break

      case 'dislike':
        /* adds user chosen reaction */
        if (!post.impressions.dislikes.usernames.includes(username)) {
          post.impressions.dislikes.number+=1
          post.impressions.dislikes.usernames.push(username)
        }
        /* remove user other reactions */
        if (post.impressions.veryLikes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.veryLikes.usernames": username } });
          post.impressions.veryLikes.number-=1
        }
        if (post.impressions.likes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.likes.usernames": username } });
          post.impressions.likes.number-=1
        }
        if (post.impressions.veryDislikes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.veryDislikes.usernames": username } });
          post.impressions.veryDislikes.number-=1
        }
        /* aggiunge il post alla lista dell'utente, se non c'è già*/
        if (user && !user.impressedPostIds.dislikes.includes(postId)) {
          user.impressedPostIds.dislikes.push(postId)
          /* toglie il post dalla lista dell'utente, nel caso ci sia */
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.veryLikes": postId} })
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.likes": postId} })
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.veryDislikes": postId} })
        }
        break

      case 'veryDislike':
        /* adds user chosen reaction */
        if (!post.impressions.veryDislikes.usernames.includes(username)) {
          post.impressions.veryDislikes.number+=1
          post.impressions.veryDislikes.usernames.push(username)
        }
        /* remove user other reactions */
        if (post.impressions.veryLikes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.veryLikes.usernames": username } });
          post.impressions.veryLikes.number-=1
        }
        if (post.impressions.likes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.likes.usernames": username } });
          post.impressions.likes.number-=1
        }
        if (post.impressions.dislikes.usernames.includes(username)) {
          await Post.updateOne({ postId: postId }, { $pull: { "impressions.dislikes.usernames": username } });
          post.impressions.dislikes.number-=1
        }
        /* aggiunge il post alla lista dell'utente, se non c'è già*/
        if (user && !user.impressedPostIds.veryDislikes.includes(postId)) {
          user.impressedPostIds.veryDislikes.push(postId)
          /* toglie il post dalla lista dell'utente, nel caso ci sia */
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.veryLikes": postId} })
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.likes": postId} })
          await User.updateOne({username: username}, { $pull: {"impressedPostIds.dislikes": postId} })
        }
        break

      case 'view':
        if (!post.impressions.views.usernames.includes(username)) {
          post.impressions.views.number+=1
          post.impressions.views.usernames.push(username)
          user?.impressedPostIds.views.push(postId)
        }
        break
      default:
        return res.status(200)
        break
    }
    await post.save()
    await user?.save()
    return res.status(200).json(post)
  }
  catch(err){
    return res.status(500).json({message: err.message});
  }
}

const getPostMentions = async (req,res) => {
  try {
      const postId = req.params.id
    
      const post = await Post.findOne({postId: postId})
      if (!post) return res.status(404).json({message: "post not found"})
    
      return res.status(200).json(post)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

/*
il post che fa da risposta deve essere già stato creato
il post nel body (replyPost) è la risposta al post che sta nei params (mainPost)
*/
const addReply = async (req,res) => {
  try {
    const mainPostId = req.params.id
    const {replyPostId} = req.body

    const mainPost = await Post.findOne({postId: mainPostId})
    if (!mainPost) return res.status(404).json({message: ("main post ", mainPostId, " not found")})

    const replyPost = await Post.findOne({postId: replyPostId})
    if (!replyPost) return res.status(404).json({message: ("reply post ", replyPostId, " not found")})

    replyPost.replyTo = mainPostId
    await replyPost.save()

    mainPost.replies.push(replyPostId)
    await mainPost.save()

    return res.status(200).json(replyPostId)
    
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const getReplies = async (req,res) => {
  try {
    const postId = req.params.id
    
    const post = await Post.findOne({postId: postId})
    if (!post) return res.status(404).json({message: "post not found"})
  
    const repliesArray = post.replies
  
    return res.status(200).json(repliesArray)

  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

//creata per essere usata dal NewPost per copiare i destinatari quando si risponde ad un post. il post riceve questa informazione dal getPost
const getReceivers = async(req,res) => {
  try {
    const postId = req.params.id
    
    const post = await Post.findOne({postId: postId})
    if (!post) return res.status(404).json({message: "post not found"})
  
    const receiversArray = post.receivers
  
    return res.status(200).json(receiversArray)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const searchPostByText = async(req,res) => {
  try {
    const query = req.params.query
    console.log("searchPostByText query: ", query)

    const posts = await Post.find({ text: { $regex: new RegExp(query, 'i') }}, 'postId -_id')
    postIds = posts.map(post => post.postId)
    console.log("searchPostByText postIds: ", postIds)
    return res.status(200).json(postIds)

  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const searchPostByUsername = async(req,res) => {
  try {
    const query = req.params.query

    const posts = await Post.find({ username: query }, 'postId -_id')
    postIds = posts.map(post => post.postId)
    console.log("searchPostByUsername postIds: ", postIds)
    return res.status(200).json(postIds)

  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const searchPostByKeyword = async(req,res) => {
  try {
    const query = req.params.query

    const posts = await Post.find({ receivers: { $in: ["#"+query] }}, 'postId -_id');
    postIds = posts.map(post => post.postId)
    return res.status(200).json(postIds)

  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

module.exports = {
  createPost,
  getFeed,
  getFeedIds,
  getPost,
  updateImpressions,
  getPostMentions,
  addReply,
  getReplies,
  getReceivers,
  searchPostByText,
  searchPostByUsername,
  searchPostByKeyword
}