const Channel = require('../models/channelModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')

const checkUserPermissions = async (username,channelName,role) => {
  const channel = await Channel.findOne({channelName:channelName})
  let permissionOK = false;
  //non ci sono break di proposito
  switch(role){
    case 'reader':
      permissionOK = permissionOK || channel.usernames.readers.includes(username)
    case 'writer':
      permissionOK = permissionOK || channel.usernames.writers.includes(username)
    case 'owner':
      permissionOK = permissionOK || channel.usernames.owners.includes(username)
      break
    default:
      break
  }
  return permissionOK
}


const createChannel = async (req,res) => {
  try{
    const {channelName, username, description, owners, writers, readers, reserved} = req.body
    const user = await User.findOne({username:username})

    let channelNameAdjusted = channelName

    if (!user)                                                                        return res.status(404).json({message: "user not found"})
    while (channelNameAdjusted[0] == " ") channelNameAdjusted = channelNameAdjusted.slice(1)
    while (channelNameAdjusted[channelNameAdjusted.length -1] == " ") channelNameAdjusted = channelNameAdjusted.slice(0, -1)
    if (channelNameAdjusted.includes(" "))                                            return res.status(403).json({message: "channel name can't contain whitespaces"})
    if ((reserved) && (channelNameAdjusted != channelNameAdjusted.toUpperCase()))     return res.status(403).json({message: "reserved channels can contain only uppercase characters"})
    if ((!reserved) && (channelNameAdjusted != channelNameAdjusted.toLowerCase()))    return res.status(403).json({message: "normal channels can contain only lowercase characters"})
    
    const dbChannel = await Channel.findOne({channelName: channelNameAdjusted})
    if (dbChannel)                                                                    return res.status(409).json({message: "channel name already taken"})

    const channel = new Channel({
      channelName: channelNameAdjusted,
      description: description,
      reserved: reserved,
      usernames: {
        owners: owners,
        writers: writers,
        readers: readers,
        subs: [username]
      }
    })
    user.channels.push(channel.channelName)
    user.ownedChannels.push(channel.channelName)
    await user.save()
    const newChannel = await channel.save()
    return res.status(201).json(newChannel)
  }
  catch(err){
    return res.status(500).json({message: err.message})
  }
}

/*
aggiunge un utente alla lista di persone aventi il ruolo richiesto.
inoltre, rimuove l'utente da tutte le liste di ruoli che non sono quello richiesto
*/
const addUserToChannel = async (req,res) =>{
  try{
    /*
    requestedRole = "owner" | "writer" | "reader"
    */
    const {username, requestedRole} = req.body
    const channelName = req.params.channelName

    const channel = await Channel.findOne({channelName:channelName})
    if(!channel) return res.status(404).json({message: "Channel not found"})
    const user = await User.findOne({username:username})
    if (!user) return res.status(404).json({message: "User not found"})

    let found = null;
    switch(requestedRole) {
      case "owner":
        found = await Channel.findOne({channelName: channelName, "usernames.owners": username});
        if(!found) {
          channel.usernames.owners.push(username);
          await Channel.updateOne({ channelName: channelName }, { $pull: { "usernames.writers": username } });
          await Channel.updateOne({ channelName: channelName }, { $pull: { "usernames.readers": username } });
        }
        break;
      case "writer":
        found = await Channel.findOne({channelName: channelName, "usernames.writers": username});
        if(!found) {
          channel.usernames.writers.push(username);
          await Channel.updateOne({ channelName: channelName }, { $pull: { "usernames.owners": username } });
          await Channel.updateOne({ channelName: channelName }, { $pull: { "usernames.readers": username } });
        }
        break;
      case "reader":
        found = await Channel.findOne({channelName: channelName, "usernames.readers": username});
        if(!found) {
          channel.usernames.readers.push(username);
          await Channel.updateOne({ channelName: channelName }, { $pull: { "usernames.owners": username } });
          await Channel.updateOne({ channelName: channelName }, { $pull: { "usernames.writers": username } });
        }
        break;
      default:
        found = null;
        return res.status(400).json({message: "bad requestedRole"})
        break;
    }
    user.channel.push(channel._id)
    await user.save()
    await channel.save()
    return res.status(200).json({message: "user added"})

  }catch(err){
    return res.status(500).json({message:err.message})
  } 
}

const getChannelPostIds = async (req, res) => {
  try {
    const channelName = req.params.channelName
    const pageNumber = req.params.pageNumber || 1

    const numberOfPosts = 10

    const channel = await Channel.findOne({channelName: channelName})
    if (!channel)  return res.status(404).json({message: "channel not found"})

    const start = (pageNumber - 1) * numberOfPosts
    const end = pageNumber * numberOfPosts
    const postIds = channel.postsIds.slice(start, end)

    console.log("getChannelPostIds postIds: ", postIds)
    if (postIds) return res.status(200).json(postIds);
    else res.status(200).json([]);
  }
  catch(err) {
    return res.status(500).json({message: err.message})
  }
}

const searchChannelByChannelName = async (req, res) => {
  try {
    const query = req.params.channelName

    const channels = await Channel.find({ channelName: { $regex: new RegExp(query, 'i') }}, 'channelName -_id')
    channelnames = channels.map(channel => channel.channelName)

    return res.status(200).json(channelnames)
  } catch(err) {
    return res.status(500).json({message: err.message})
  }
}

const searchChannelByChannelNameOneResult = async (req, res) => {
  try {
    const query = req.params.channelName

    const channels = await Channel.findOne({ channelName: { $regex: new RegExp(query, 'i') }}, 'channelName -_id').then(response => response?.channelName)

    return res.status(200).json(channels ? [channels] : [])
  } catch(err) {
    return res.status(500).json({message: err.message})
  }
}

// const getChannel = async (req,res) =>{
//   const id = req.params.id
//   const channel = Channel.findOne({_id:id})
//   if (checkUserPermissions(req.params.userName,channel.channelName,'reader')){
//     res.status(200).json(channelName)
//   }else {
//     res.status(400).json({message:err.message})
//   }
// }

const getChannelData = async (req, res) => {

  try {
    const channelName = req.params.channelName
    
    const channel = await Channel.findOne({channelName: channelName})

    if (!channel) return res.status(404).json({message: "channel not found"})

    return res.status(200).json(channel)
  } catch(err) {
    return res.status(500).json({message: err.message})
  }
}

//non ho ancora provato se funziona
const updateChannelData = async (req, res) => {
  try {
    const { channelName } = req.params;
    const { description, usernames } = req.body;

    console.log("updateChannelData channelName, description, usernames: ", channelName, description, usernames)

    const channelOld = await Channel.findOne({channelName: channelName})
    if (!channelOld) return res.status(404).json({message: "channel not found"})

    const updatedChannel = await Channel.findOneAndUpdate(
      { channelName },
      { 
        description, 
        "usernames.owners": usernames.owners,
        "usernames.writers": usernames.writers,
        "usernames.readers": usernames.readers
      },
      { new: true }
    );

    //aggiorna nuovi proprietari
    await usernames.owners.map(async (username) => {
      user = await User.findOne({username: username})
      if (user && !user.ownedChannels.includes(channelName)) {
        user.ownedChannels.push(channelName)
        await user.save()
      }
    })
    //rimuovi canale da proprietari rimossi
    await channelOld.usernames.owners.filter(owner => !usernames.owners.includes(owner))
    .map(async (username) => {
      user = await User.findOne({username: username})
      if (user) {
        user.ownedChannels = user.ownedChannels.filter(channel => channel !== channelName)
        await user.save()
      }
    })

    if (!updatedChannel) {
      return res.status(404).json({ error: 'channel not found' });
    }

    console.log("updateChannelData updatedChannel: ", updatedChannel)

    res.json(updatedChannel);
  } catch (error) {
    res.status(500).json({message: err.message});
  }
}

const addSubscriberToChannel = async (req, res) => {
  try {
    const channelName = req.params.channelName
    const { username } = req.body

    const channel = await Channel.findOne({channelName: channelName})
    if (!channel) return res.status(404).json({message: "channel not found"})

    const user = await User.findOne({username: username})
    if (!user) return res.status(404).json({message: "user not found"})

    if (!channel.usernames.subs.includes(username)) channel.usernames.subs.push(username)
    await channel.save()

    if (!user.channels.includes(channelName)) user.channels.push(channelName)
    await user.save()

    return res.status(200)
  } catch(err) {
    return res.status(500).json({message: err.message})
  }
}

const removeSubscriberFromChannel = async (req, res) => {
  try {
    const channelName = req.params.channelName
    const { username } = req.body

    const channel = await Channel.findOne({channelName: channelName})
    if (!channel) return res.status(404).json({message: "channel not found"})

    const user = await User.findOne({username: username})
    if (!user) return res.status(404).json({message: "user not found"})

    await Channel.updateOne(
      { channelName: channelName },
      { $pull: { 'usernames.subs': username } }
    )

    await User.updateOne(
      { username: username },
      { $pull: { channels: channelName } }
    )

    return res.status(200)
  } catch(err) {
    return res.status(500).json({message: err.message})
  }
}

const findChannels = async (req,res) => {
  try {
    const { channelName, owner, minNPosts, maxNPosts } = req.body

    console.log("mod findChannels channelName: ", channelName)
    console.log("mod findChannels owner: ", owner)
    console.log("mod findChannels minNPosts: ", minNPosts)
    console.log("mod findChannels maxNPosts: ", maxNPosts)

    let query = {}

    if (channelName) 
      query.channelName = channelName
    
    if (owner) 
      query['usernames.owners'] = { $in: [owner] }

    const channels = await Channel.find(query)

    const filteredChannels = channels.filter(channel => {
      let minOK = true
      let maxOK = true
      if (minNPosts) minOK = channel.postsIds.length >= minNPosts
      if (maxNPosts) maxOK = channel.postsIds.length <= maxNPosts
      return (minOK && maxOK)
    })

    const channelNames = filteredChannels.map(channel => channel.channelName)

    console.log("findChannels: ", channelNames)

    return res.status(200).json(channelNames)
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}




module.exports = {
  createChannel,
  addUserToChannel,
  getChannelPostIds,
  searchChannelByChannelName,
  searchChannelByChannelNameOneResult,
  getChannelData,
  updateChannelData,
  addSubscriberToChannel,
  removeSubscriberFromChannel,
  findChannels
}
