const User = require('../../models/userModel')
const Post = require('../../models/postModel')
const Channel = require('../../models/channelModel')

const axios = require('axios');



async function getImageAsBase64(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    return imageBase64;
}


/* * * gatti * * */

async function getCatImage() {
    const catAPIresponse = await fetch(`https://api.thecatapi.com/v1/images/search`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .catch((error) => {
    console.error('errore getCatImage thecatapi:', error)
    })


    const catURL = catAPIresponse[0]["url"]

    const catImageBase64 = "data:image/jpeg;base64," + (await getImageAsBase64(catURL))

    return catImageBase64
}

async function makeNewCatPost() {

    const automaticImage = await getCatImage()

    const newPost = new Post({
        postId: "",
        username: "squealerBot",
        displayName: "post Automatici",
        text: automaticImage,
        receivers: ["§GATTINI"],
        mentions: []
    })
    await newPost.save()

    const channel = await Channel.findOne({channelName: "GATTINI"})

    if (channel) {
        channel.postsIds.push(newPost._id)
        await channel.save()
    }

    console.log("nuovo post automatico §GATTINI")
}


/* * * lorem picsum * * */

async function makeLoremPicsumPost() {
    const automaticImage = "data:image/jpeg;base64," + (await getImageAsBase64("https://picsum.photos/500/400"))

    const newPost = new Post({
        postId: "",
        username: "squealerBot",
        displayName: "post Automatici",
        text: automaticImage,
        receivers: ["§FOTO"],
        mentions: []
    })
    await newPost.save()

    const channel = await Channel.findOne({channelName: "FOTO"})

    if (channel) {
        channel.postsIds.push(newPost._id)
        await channel.save()
    }

    console.log("nuovo post automatico §FOTO")
}

/* * * notizie * * */
const NEWS_API_KEY = "66b8694fc3724ee483578f4fbaa04e28"

async function fetchNews() {
    const url = [
        // da Apple, popolari, in inglese, da oggi
        `https://newsapi.org/v2/everything?q=Apple&from=2024-02-20&sortBy=popularity&apiKey=${NEWS_API_KEY}`,
        // top-headlines, in inglese, da oggi
        `https://newsapi.org/v2/top-headlines?country=us&language=en&apiKey=${NEWS_API_KEY}`,
        // top-headlines da BBC, in inglese, da oggi
        `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${NEWS_API_KEY}`,
        // top-headlines da business, in tedesco, da oggi
        `https://newsapi.org/v2/top-headlines?country=de&category=business&apiKey=${NEWS_API_KEY}`,
        // top-headlines su Trupm, in inglese, da oggi
        `https://newsapi.org/v2/top-headlines?q=trump&apiKey=${NEWS_API_KEY}`,
        // top-headlines su Unibo, in inglese, da oggi
        `https://newsapi.org/v2/top-headlines?country=it&q=unibo&apiKey=${NEWS_API_KEY}`,
        // top-headlines su Caltanissetta, in inglese, da oggi
        `https://newsapi.org/v2/top-headlines?country=uk&q=beans&apiKey=${NEWS_API_KEY}`,
        // // top-headlines su Caltanissetta, in inglese, da oggi
        `https://newsapi.org/v2/top-headlines?country=it&q=monster&apiKey=${NEWS_API_KEY}`,
        // // top-headlines su Caltanissetta, in inglese, da oggi
        `https://newsapi.org/v2/top-headlines?country=us&q=russia&apiKey=${NEWS_API_KEY}`,
        // // top-headlines su Caltanissetta, in inglese, da oggi
        `https://newsapi.org/v2/top-headlines?country=it&q=lega&apiKey=${NEWS_API_KEY}`,
    ];

    const randomIndex = Math.floor(Math.random() * url.length)

    const response = await fetch(url[randomIndex])
    const data = await response.json()

    const postText = data["articles"][0]["title"] + "   " + data["articles"][0]["url"]

    return postText;
}

async function makeNewsPost() {
    const newsText = await fetchNews()

    const newPost = new Post({
        postId: "",
        username: "squealerBot",
        displayName: "post Automatici",
        text: newsText,
        receivers: ["§NEWS"],
        mentions: []
    })
    await newPost.save()

    const channel = await Channel.findOne({channelName: "NEWS"})

    if (channel) {
        channel.postsIds.push(newPost._id)
        await channel.save()
    }

    console.log("nuovo post automatico §NEWS")
}



//fai partire i timer
function startTimers() {
    const n_minuti = 15

    setInterval(makeNewCatPost, n_minuti * 60 * 1000)
    setInterval(makeLoremPicsumPost, n_minuti * 60 * 1000)
    setInterval(makeNewsPost, n_minuti * 60 * 1000)


}

module.exports = {
    startTimers
}