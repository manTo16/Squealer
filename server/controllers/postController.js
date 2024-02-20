const User = require('../models/userModel')
const Post = require('../models/postModel')
const Channel = require('../models/channelModel')

const { checkReceiverSyntax, parseTextForMentions, checkAddressSyntax } = require('./utils/postUtils')
const { createPostInterval } = require('./utils/automaticPosts')
const { checkPopularity, _addPostToChannel } = require( './utils/criticalMass')

//poi magari spostiamo la funzione in un altro file che includiamo qua



const createPost = async (req,res) => {
  try{
    const {username, text, receivers, repeatPostInterval} = req.body;
    const user = await User.findOne({username: username});

    //rimuovi elementi vuoti dall'array dei destinatari
    //console.log("createPost receivers: ", receivers)
    const receiversCopy = receivers.filter(checkReceiverSyntax);

    receiversCopy.map((receiver) => console.log("receiver: ", receiver))
    /* prendi menzioni dal testo del post */
    const mentions = parseTextForMentions(text)
    //console.log("createPost mentions: ", mentions)

    const newPost = new Post({
      postId: "",
      username: username,
      displayName: user.displayName,
      text: text,
      receivers: receiversCopy,
      mentions: mentions
    })
    //res.status(400).json({message: JSON.stringify(user.username) })
    await newPost.save();

    console.log("creato post di ", username, " con destinatari ", receivers, " menzioni ", mentions, " di lunghezza ", text.length)

    /* aggiungi il post ai canali ai quali è destinato */
    receiversCopy.filter(receiver => receiver[0] === "§").map(async (receiver) => {
      console.log("createPost filter map receiver: ", receiver)      
      let channel = await Channel.findOne({channelName: receiver.slice(1)})
      console.log("createPost filter map channel._id: ", channel?._id)
      if(channel) {
        //console.log("createPost sono dentro l'if")
        console.log("createPost channel: ", channel)
        console.log("createPost newPost._id: ", newPost._id)
        channel.postsIds.push(newPost._id)
        await channel.save()
      }
    })

    //se l'api ritorna -1 nell'intervalId significa che non è stata programmata nessuna ripetizione di post
    let intervalId = -1
    if (repeatPostInterval.interval !== 0) {
      let unitMultiplier = 0
      switch(repeatPostInterval.unit) {
        case "Secondi":
          unitMultiplier = 1
          break
        case "Minuti":
          unitMultiplier = 60
          break
        case "Ore":
          unitMultiplier = 60 * 60
          break
        case "Giorni":
          unitMultiplier = 60 * 60 * 24
          break
        default:
          unitMultiplier = 0
      }
      intervalId = createPostInterval(username, text, receivers, 1000 * unitMultiplier * repeatPostInterval.interval)
    }

    return res.status(200).json({postId: newPost.postId, intervalId: intervalId});
  } catch(err) {
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
    pageNumber = req.params.pageNumber || 1;

    const postIdsMongoose = await Post.find({}, "_id")
                               .sort({creationDate: -1})
                               .skip((pageNumber - 1) * numberOfPosts)
                               .limit(numberOfPosts)
                               .lean();
    const postIds = postIdsMongoose.map(post => post._id.toString())
    //console.log("getFeedIds page ", pageNumber, " postIds: ", postIds)
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
        //le visualizzazioni da sloggato possono essere ripetute
        //tuttavia, sono controllate dal localstorage. quindi l'utente medio vede un post una volta per dispostivo
        if (!post.impressions.views.usernames.includes(username) || username === "guestUser") {
          post.impressions.views.number+=1
          post.impressions.views.usernames.push(username)
          user?.impressedPostIds.views.push(postId)

          if (post.impressions.views.number === 10) await checkPopularity(post)
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
    const pageNumber = req.params.pageNumber || -1
    const numberOfPosts = 5
    
    const post = await Post.findOne({postId: postId})
    if (!post) return res.status(404).json({message: "post not found"})
  
    let repliesArray = []
    //l'api funziona sia con la pagina che senza. senza pagina ritorna tutte le risposte
    if (pageNumber !== -1) {
      const start = (pageNumber - 1) * numberOfPosts
      const end = pageNumber * numberOfPosts
      repliesArray = post.replies.slice(start, end)
    }
    else {
      repliesArray = post.replies
    }
  
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

    const numberOfPosts = req.params.pageNumber ? 10 : 100 //se chiede per pagine ritorno 10 post (alla volta), altrimenti molti di più
    const pageNumber = req.params.pageNumber || 1

    const posts = await Post.find({ text: { $regex: new RegExp(query, 'i') }}, 'postId -_id')
                        .sort({creationDate: -1})
                        .skip((pageNumber - 1) * numberOfPosts)
                        .limit(numberOfPosts);
    const postIds = posts.map(post => post.postId)

    console.log("searchPostByText postIds: ", postIds)
    return res.status(200).json(postIds)

  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const searchPostByUsername = async(req,res) => {
  try {
    const query = req.params.query

    const numberOfPosts = req.params.pageNumber ? 10 : 100 //se chiede per pagine ritorno 10 post (alla volta), altrimenti molti di più
    const pageNumber = req.params.pageNumber || 1
    console.log("searchPostsByUsername pageNumber: ", pageNumber, " parametri url: ", req.params.pageNumber)

    const posts = await Post.find({ username: query }, 'postId -_id')
                        .sort({creationDate: -1})
                        .skip((pageNumber - 1) * numberOfPosts)
                        .limit(numberOfPosts);
    const postIds = posts.map(post => post.postId)
    console.log("searchPostByUsername postIds: ", postIds)
    return res.status(200).json(postIds)

  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const searchPostByKeyword = async(req,res) => {
  try {
    const query = req.params.query

    const numberOfPosts = req.params.pageNumber ? 10 : 100 //se chiede per pagine ritorno 10 post (alla volta), altrimenti molti di più
    const pageNumber = req.params.pageNumber || 1

    const posts = await Post.find({ receivers: { $in: ["#"+query] }}, 'postId -_id')
                        .sort({creationDate: -1})
                        .skip((pageNumber - 1) * numberOfPosts)
                        .limit(numberOfPosts);
    const postIds = posts.map(post => post.postId)
    return res.status(200).json(postIds)

  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const addPostToChannel = async (req,res) => {
  try {
    const { postId, channelName } = req.body
    _addPostToChannel(postId, channelName)

    return res.status(200).json({channelName, postId})
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const findPosts = async (req,res) =>{
  try {
    const { squealContains, sender, receiver, minDate, maxDate } = req.body

    console.log("mod findPosts squealContains: ", squealContains)
    console.log("mod findPosts sender: ", sender)
    console.log("mod findPosts minDate: ", minDate)
    console.log("mod findPosts maxDate: ", maxDate)
    console.log("mod findPosts receivers: ", receiver)


    let query = {}

    if (sender) 
      query.username = sender
    
    if (minDate)
      query.creationDate = { $gt: new Date(minDate) }

    if (maxDate)
      query.creationDate = { $lt: new Date(maxDate) }

    if (squealContains)
      query.text = { 
        $regex: new RegExp(squealContains, 'i'),
        $not: /^data:image\//i
      }

    if (receiver.length !== 0) {
      query.receivers = { $all: receiver.filter(checkReceiverSyntax) }
    }

    const posts = (await Post.find(query, '_id')).map(post => post._id.toString())

    console.log("findPosts: ", posts)

    return res.status(200).json(posts)

  } catch (error) {
    console.error('errore findPosts:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
}

const updatePost = async (req, res) => {
  try {
    console.log("updatePost ", req.params.id)
    console.log(" impressions: ", req.body.impressions)
    const newReceivers = req.body.receivers
    console.log(" receivers: ", newReceivers)

    const oldReceivers = (await Post.findOne({postId: req.params.id}, "receivers -_id")).receivers
    console.log("AAAAAA ", oldReceivers)

    const updates = {};
    if (req.body.impressions) {
      if (req.body.impressions.veryLikes) {
        updates['impressions.veryLikes.number'] = req.body.impressions.veryLikes.number
      }
      if (req.body.impressions.likes) {
        updates['impressions.likes.number'] = req.body.impressions.likes.number
      }
      if (req.body.impressions.dislikes) {
        updates['impressions.dislikes.number'] = req.body.impressions.dislikes.number
      }
      if (req.body.impressions.veryDislikes) {
        updates['impressions.veryDislikes.number'] = req.body.impressions.veryDislikes.number
      }
    }
    if (newReceivers) updates["receivers"] = newReceivers

    const updatedPost = await Post.updateOne({ _id: req.params.id }, { $set: updates })

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post non trovato' })
    }

    //aggiunge post a canali nuovi
    const receiversCopy = newReceivers.filter(checkAddressSyntax);
    receiversCopy.filter(receiver => receiver[0] === "§").map(async (receiver) => {
      let channel = await Channel.findOne({channelName: receiver.slice(1)})
      if(channel) {
        channel.postsIds.push(req.params.id)
        await channel.save()
      }
    })

    //toglie post da canali rimossi   TODO NON FUNZIONA 
    const removedChannels = oldReceivers.filter(channel => {
      return channel.startsWith('§') && !newReceivers.includes(channel)
    })
  
    const updatePromises = removedChannels.map(channelName => {
        return Channel.updateOne({channelName: channelName.slice(1)}, { $pull: { postsIds: req.params.id } })
    })
  
    Promise.all(updatePromises)
      .then(() => {
          console.log('updatePost ho rimosso i post dai ', updatePromises.length, ' canali');
      })
      .catch(err => {
          console.error('updatePost Errore durante l\'aggiornamento dei canali:', err);
      })

    return res.status(200).json(updatedPost)
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del post:', error)
    res.status(500).json({ error: 'Errore del server' })
  }
}

//sortBy:   views / positiveReactions / negativeReactions
const getUserPostsSorted = async (req,res) => {
  try {
    const username = req.params.userName
    const sortBy = req.params.sortBy

    let posts = []
    let postIds = []

    switch (sortBy) {
      case "views":
        posts = await Post.find({ username: username }, 'postId -_id')
                            .sort({"impressions.views.number": -1})
        postIds = posts.map(post => post.postId)
        break
      case "positiveReactions":
        posts = await Post.aggregate([
            { $match: { username: username } },
            { $addFields: { totalLikes: { $add: ["$impressions.veryLikes.number", "$impressions.likes.number"] } } },
            { $sort: { totalLikes: -1 } },
            { $project: { postId: 1, _id: 0 } }
        ])
        
        postIds = posts.map(post => post.postId);
        break
      case "negativeReactions":
        posts = await Post.aggregate([
          { $match: { username: username } },
          { $addFields: { totalLikes: { $add: ["$impressions.veryLikes.number", "$impressions.likes.number"] } } },
          { $sort: { totalLikes: -1 } },
          { $project: { postId: 1, _id: 0 } }
        ])
        postIds = posts.map(post => post.postId)
        break
    }

    console.log("getUserPostsSorted by", sortBy, " postIds: ", postIds)

    return res.status(200).json(postIds)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

const getPersonalFeedIds = async (req,res) => {
  try {
    numberOfPosts = 10;
    username = req.params.userName
    pageNumber = req.params.pageNumber || 1;

    const user = await User.findOne({username: username})
    if (!user) return res.status(200).json([])

    const userChannels = user.channels
    const defaultChannels = ["NEWS", "GATTINI", "FOTO"] //questi sono i canali non silenziabili
    
    const channelPool = userChannels.concat(defaultChannels)
    console.log("debug channelPool ", channelPool)

    // ottengo gli id dei post dai canali in channelPool
    const channels = await Channel.find({ channelName: { $in: channelPool } }).populate('postsIds');
    console.log("DEBUG ", channels.length)
    const postIdsFromChannels = channels.flatMap(channel => channel.postsIds);

    // ottengo gli id dei post che hanno l'utente nei destinatari
    const postIdsFromReceivers = await Post.find({ receivers: `@${username}` }, "_id").lean();
    const postIdsFromReceiversStr = postIdsFromReceivers.map(post => post._id.toString())

    // unisco i postIdsFromChannels e postIdsFromReceivers
    const combinedPostIds = [...postIdsFromChannels, ...postIdsFromReceiversStr];

    const postIdsMongoose = await Post.find({ _id: { $in: combinedPostIds }, replyTo: null }, "_id")
                               .sort({creationDate: -1})
                               .skip((pageNumber - 1) * numberOfPosts)
                               .limit(numberOfPosts)
                               .lean();
    const postIds = postIdsMongoose.map(post => post._id.toString())
    //console.log("getFeedIds page ", pageNumber, " postIds: ", postIds)
    return res.status(200).json(postIds);
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}



const getPosts = async (req,res) =>{
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json({
      posts,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error('Errore durante il recupero dei post:', error);
    res.status(500).json({ error: 'Errore del server' });
  }
}

const createPostBySMM = async (req,res) =>{
  try{
    const {username, text, receivers,smmUsername} = req.body;
    const user = await User.findOne({username: username});
    const smm = await User.findOne({username: smmUsername});
    if (!smm.smmClients.includes(username)) {
      throw new Error('Not present in client list')
    }

    const receiversCopy = receivers.filter(checkReceiverSyntax);
    const mentions = parseTextForMentions(text)


    const newPost = new Post({
      postId: "",
      username: username,
      displayName: user.displayName,
      text: text,
      receivers: receiversCopy,
      mentions: mentions
    })
    //res.status(400).json({message: JSON.stringify(user.username) })
    await newPost.save();

    console.log("creato post di ", username, " con destinatari ", receivers, " menzioni ", mentions, " di lunghezza ", text.length)

    /* aggiungi il post ai canali ai quali è destinato */
    receiversCopy.filter(receiver => receiver[0] === "§").map(async (receiver) => {
      console.log("createPost filter map receiver: ", receiver)      
      let channel = await Channel.findOne({channelName: receiver.slice(1)})
      console.log("createPost filter map channel._id: ", channel?._id)
      if(channel) {
        //console.log("createPost sono dentro l'if")
        console.log("createPost channel: ", channel)
        console.log("createPost newPost._id: ", newPost._id)
        channel.postsIds.push(newPost._id)
        await channel.save()
      }
    })




    return res.status(200).json({postId: newPost.postId});
  } catch(err) {
    return res.status(409).json({message: err.message})
  }
}


module.exports = {
  getPosts,
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
  searchPostByKeyword,
  _addPostToChannel,
  addPostToChannel,
  findPosts,
  updatePost,
  createPostBySMM,
  getUserPostsSorted,
  getPersonalFeedIds
}