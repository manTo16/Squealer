const Channel = require('../models/channelModel')
const User = require('../models/userModel')

const createChannel = async (req,res) => {
  try{
    const {channelName,username,reserved} = req.body
    //const user = await User.findOne({username:username})
    const channel = new Channel({
      channelName,
      reserved,
      //usernames.owners[0]: username
    })
      channel.usernames.owners.push(username)
      channel.usernames.writers.push(username)
      channel.usernames.readers.push(username)
      const newChannel = await channel.save()
      res.status(201).json(newChannel)
  }
  catch(err){
    res.status(500).json({message: err.message})
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
    //non ci sono break di proposito
    switch(requestedRole) {
      case "owner":
        found = await Channel.findOne({channelName: channelName, "usernames.owners": username});
        if(!found) {
          channel.usernames.owners.push(username);
        }
      case "writer":
        found = await Channel.findOne({channelName: channelName, "usernames.writers": username});
        if(!found) {
          channel.usernames.writers.push(username);
        }
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
    await channel.save()
    res.status(200)

  }catch(err){
    res.status(500).json({message:err.message})
  } 
}

module.exports = {
  createChannel,
  addUserToChannel
}
