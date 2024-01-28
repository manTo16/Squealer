const Post = require('../../models/postModel')
const Channel = require('../../models/channelModel')
const User = require('../../models/userModel')

const { reward, punishment, registrationDailyChars, registrationWeeklyChars, registrationMonthlyChars } = require('./characterCountValues')

//massa critica
const CM = 0.40

function isPopular(post) {
    const nVeryLikes = post.impressions.veryLikes.number
    const nLikes = post.impressions.likes.number
    const nDislikes = post.impressions.dislikes.number
    const nVeryDislikes = post.impressions.veryDislikes.number

    const totalImpressions = nVeryLikes + nLikes + nDislikes + nVeryDislikes
    const positiveImpressions = nVeryLikes + nLikes

    if (positiveImpressions > totalImpressions * CM) return true
    else return false
}

function isImpopular(post) {
    const nVeryLikes = post.impressions.veryLikes.number
    const nLikes = post.impressions.likes.number
    const nDislikes = post.impressions.dislikes.number
    const nVeryDislikes = post.impressions.veryDislikes.number

    const totalImpressions = nVeryLikes + nLikes + nDislikes + nVeryDislikes
    const negativeImpressions = nVeryDislikes + nDislikes

    if (negativeImpressions > totalImpressions * CM) return true
    else return false
}

function isControversial(post) {
    return isPopular(post) && isImpopular(post)
}

/*
controlla la popolarità del post e fa quello che è necessario per
    categorizzare il post
    premiare/punire l'utente 
NON FA CONTROLLI NULL
*/
async function checkPopularity(post) {
    const user = await User.findOne({username: post.username})

    if (isControversial(post)) {
        _addPostToChannel(post.postId, "CONTROVERSIAL")
    }

    else if (isPopular(post)) {
        _addPostToChannel(post.postId, "POPULAR")
        await rewardUser(user)
    }

    else if (isImpopular(post)) {
        _addPostToChannel(post.postId, "IMPOPULAR")
        await punishUser(user)
    }
    return
}

/*
NON FA CONTROLLI NULL
*/
async function rewardUser(user) {
    user.dailyChar += parseInt(reward * registrationDailyChars)
    user.weeklyChar += parseInt(reward * registrationWeeklyChars)
    user.monthlyChar += parseInt(reward * registrationMonthlyChars)

    await user.save()
}

async function punishUser(user) {
    user.dailyChar -= parseInt(punishment * registrationDailyChars)
    user.weeklyChar -= parseInt(punishment * registrationWeeklyChars)
    user.monthlyChar -= parseInt(punishment * registrationMonthlyChars)

    await user.save()
}



/*
se il post è già nel canale non crea duplicati
la versione senza richieste express per poterla usare anche da altre parti
*/
async function _addPostToChannel(postId, channelName) {

    const post = await Post.findOne({postId: postId})
    if (!post) return res.status(404).json({message: "post not found"})
  
    const channel = await Channel.findOne({channelName: channelName})
    if (!channel) return res.status(404).json({message: "channel not found"})
  
    if (!channel.postsIds.includes(postId)) channel.postsIds.push(postId)
  
    await channel.save()
  
  
}


module.exports = {
    checkPopularity,
    _addPostToChannel
}