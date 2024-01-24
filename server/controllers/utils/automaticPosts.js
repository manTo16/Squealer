const User = require('../../models/userModel')
const Post = require('../../models/postModel')
const Channel = require('../../models/channelModel')

const { checkReceiverSyntax, parseTextForMentions } = require('./postUtils')


//id univoco associato ad un post automatico, inviato al frontend 
let nextUniqueId = 1;

//oggetto contenente un array per ogni username. l'array contiene gli id univoci collegati ai post automatici dell'utente
let userIntervals = {};

//array usato per mappare gli id univoci agli oggetti che setInterval e clearInterval vogliono
let intervalMap = []


/*
questa funzione crea un intervalId finto. in realtà è un id univoco (incrementale)
che è associato al vero intervalId voluto da clearTimer in intervalMap
per avere l'intervalMap vero si usa getIntervalIdFromUniqueId dandogli l'id che l'api manda al frontend
*/
function addUserInterval(username, action, interval_ms) {
  const intervalId = setInterval(action, interval_ms);
  const uniqueId = nextUniqueId++;

  // Se l'utente non ha ancora un array di intervalli, creane uno
  if (!userIntervals[username]) {
    userIntervals[username] = [];
  }

  userIntervals[username].push(uniqueId);
  intervalMap.push({uniqueId: uniqueId, intervalId: intervalId})

  console.log("addUserInterval aggiungo azione richiesta da ", username," con uniqueId ", uniqueId ," da ripetere ogni ", interval_ms, "ms")
  return uniqueId
}


function getIntervalIdFromUniqueId(uniqueId, intervalMap) {
    const intervalObject = intervalMap[uniqueId];
  
    if (intervalObject) {
      return intervalObject.intervalId;
    }
  
    return null;
}


function removeUserInterval(username, uniqueId) {
  clearInterval(getIntervalIdFromUniqueId(uniqueId, intervalMap));

  const intervalIndex = userIntervals[username].indexOf(uniqueId);
  if (intervalIndex === -1) return;

  userIntervals[username].splice(intervalIndex, 1);
}


function removeAllUserIntervals(username) {
    const userIntervalIds = userIntervals[username];
  
    if (userIntervalIds) {
      userIntervalIds.forEach(uniqueId => {
        removeUserInterval(username, uniqueId);
      });
    }
  
    delete userIntervals[username];
  }


function createPostInterval(username, text, receivers, interval_ms) {
    if (interval_ms < 1) return -1

    const action = function() { automaticPosting(username, text, receivers); };
  
    //setInterval va in overflow dopo 2147483647 e in quel caso setta l'intervallo a 1. vogliamo evitare
    if (interval_ms > 2000000000) {
        console.log("createPostInterval l'intervallo richiesto è troppo ampio. riduco a 24 giorni")
        interval_ms = 2073600000
    }
    return addUserInterval(username, action, interval_ms);
}

/*
controlla, prima di creare il post, che l'utente non sia in debito
se l'utente è in debito, cancella le azioni automatiche collegate all'utente in questione
dal registro dei post automatici

se è tutto a posto, chiama la funzione per creare il post, la quale a sua volta chiama la funzione 
per ridurre i caratteri dell'utente
*/
async function automaticPosting(username, text, receivers) {
    try {
        const user = await User.findOne({username: username});
        if (user.debtChar > 0) {
            console.log(username, " in debito! blocco tutti i suoi post automatici")
            removeAllUserIntervals(username);
            return;
        }
        else {
            createPostWithParams(username, text, receivers);
        }
    } catch (err) {
        console.error(err)
    }
}

/*
copia di createPost. era più facile copiarla che sistemare req,res per usarla
pensata per essere chiamata solo da createPostInterval
*/
const createPostWithParams = async (username, text, receivers) => {
    try{

      const user = await User.findOne({username: username});
  
      //rimuovi elementi vuoti dall'array dei destinatari
      console.log("createPost receivers: ", receivers)
      const receiversCopy = receivers.filter(checkReceiverSyntax);
  
      receiversCopy.map((receiver) => console.log("receiver: ", receiver))
      /* prendi menzioni dal testo del post */
      const mentions = parseTextForMentions(text)
      console.log("createPost mentions: ", mentions)
  
      const newPost = new Post({
        postId: "",
        username: username,
        displayName: user.displayName,
        text: text,
        receivers: receiversCopy,
        mentions: mentions
      })
  
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

      updateUserCharactersWithParams(username, -text.length, -text.length, -text.length)

    } catch (err) {
      console.error(err);
    }
}

/*
copia di userController.js/updateUserCharacters
la logica deve rimanere uguale a quella funzione, quindi vanno cambiate insieme
pensata per essere chiamata solo da createPostWithParams per la creazione di post automatici
*/
const updateUserCharactersWithParams = async (username, daily, weekly, monthly) => {
    try {
      
      console.log("ricevuta richiesta di aggiornamento di caratteri per ", username, "\ndaily ", daily, " weekly ", weekly, " monthly ", monthly)
  
      const user = await User.findOne({username: username})
  
      if (!user) return res.status(404).json({message: "user not found"})
  
      if (user.debtChar === 0) {
        user.dailyChar += daily
        user.weeklyChar += weekly
        user.monthlyChar += monthly
  
        if (Math.min(user.dailyChar, user.weeklyChar, user.monthlyChar) < 0) 
          user.debtChar = -Math.min(user.dailyChar, user.weeklyChar, user.monthlyChar)
        if (user.dailyChar < 0) user.dailyChar = 0
        if (user.weeklyChar < 0) user.weeklyChar = 0
        if (user.monthlyChar < 0) user.monthlyChar = 0
      }
  
      else {
        user.debtChar -= daily
      }
  
      await user.save()
    } catch (err) {
        console.error(err);
    }
  }



  module.exports = {
    addUserInterval,
    removeUserInterval,
    createPostInterval
  }