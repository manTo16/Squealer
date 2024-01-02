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
    const {channelName, username, reserved} = req.body
    const user = await User.findOne({username:username})

    let channelNameAdjusted = channelName

    if (!user)                                                        return res.status(404).json({message: "user not found"})
    while (channelNameAdjusted[0] == " ") channelNameAdjusted = channelNameAdjusted.slice(1)
    while (channelNameAdjusted[channelNameAdjusted.length -1] == " ") channelNameAdjusted = channelNameAdjusted.slice(0, -1)
    if (channelNameAdjusted.includes(" "))                                    return res.status(403).json({message: "channel name can't contain whitespaces"})
    if ((reserved) && (channelNameAdjusted != channelNameAdjusted.toUpperCase()))     return res.status(403).json({message: "reserved channels can contain only uppercase characters"})
    if ((!reserved) && (channelNameAdjusted != channelNameAdjusted.toLowerCase()))    return res.status(403).json({message: "normal channels can contain only lowercase characters"})
    
    const channel = new Channel({
      channelName: channelNameAdjusted,
      reserved: reserved,
      //usernames.owners[0]: username
    })
    channel.usernames.owners.push(username)
    user.channels.push(channel.channelName)
    await user.save()
    const newChannel = await channel.save()
    return res.status(201).json(newChannel)
  }
  catch(err){
    return res.status(500).json({message: err.message})
  }
}

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
        }
        break;
      case "writer":
        found = await Channel.findOne({channelName: channelName, "usernames.writers": username});
        if(!found) {
          channel.usernames.writers.push(username);
        }
        break;
      case "reader":
        found = await Channel.findOne({channelName: channelName, "usernames.readers": username});
        if(!found) {
          channel.usernames.readers.push(username);
        }
        break;
      default:
        found = null;
        res.status(400).json({message: "bad requestedRole"})
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

const getChannelPosts = async (req, res) => {
  try {
    const channelName = req.params.channelName

    const numberOfPosts = 5;
    //faccio il sorting per id perchè mongodb crea l'id anche in base all'ora e il giorno in cui è stato creato un oggetto
    const postIds = await Channel.findOne({channelName: channelName}).select("postsIds").sort({_id: -1}).limit(numberOfPosts)
    console.log("getChannelPosts postIds: ", postIds)
    return res.status(200).json(postIds);
  }
  catch(err) {
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

module.exports = {
  createChannel,
  addUserToChannel,
  getChannelPosts
}
