import "./post.scss"
import VDots from "../svg/VDotsSvg"
import propic from "../../assets/person/9.png"
import Like from "../svg/Reaction/LikeSvg"
import Heart from "../svg/Reaction/HeartSvg"
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import axios from "axios"
import { apiPostsURL } from "../../URLs"

import { MutableRefObject, useEffect, useRef, useState } from "react"
import { Stack } from "react-bootstrap"
import { Button } from "react-bootstrap"
import Heartbreak from "@components/svg/Reaction/HeartbreakSvg"
import Dislike from "@components/svg/Reaction/DislikeSvg"



export default function Post({postId = "defaultId"}: {postId?: string}) {
  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue

  async function loadPostData(postId: string) {

      const loadedPostData = await axios.get(apiPostsURL + `/${postId}`).then((response) => (response?.data));
      if (loadedPostData) {
        const impressionAlreadyChosenByUser = getImpressionFromUser(loadedPostData.impressions)
        setPostData({
            postText: loadedPostData.text,
            postDisplayedName: loadedPostData.displayName,
            postUsername: loadedPostData.username,
            postReceivers: loadedPostData.receivers,
            postVeryLikesCounter: loadedPostData.impressions.veryLikes.number,
            postLikesCounter: loadedPostData.impressions.likes.number,
            postDislikesCounter: loadedPostData.impressions.dislikes.number,
            postVeryDislikesCounter: loadedPostData.impressions.veryDislikes.number,
            postImpressionChosen: impressionAlreadyChosenByUser,
            postViews: loadedPostData.impressions.views.number
        })
      }
  }

  async function sendReaction(reaction: string) {
      const response = await axios.patch(apiPostsURL+`/${postId}/impressions/${reaction}`,
                        {username: userDetails.username ?? "guestUser"})
      console.log("sendReaction response.status: ", response?.status ?? "caricamento interrotto probabilmente")
      /* praticamente se mentre sta ancora aspettando le risposte di una richiesta cambi pagina, la risposta della richiesta la dà
      undefined. almeno credo di aver capito così. quindi ho messo controlli per il null ovunque */
  }

  /* pensata per essere usata solo in loadPostData */
  function getImpressionFromUser(impressions: any) {
    const username = userDetails.username
    if (impressions.veryLikes.usernames.includes(username))
      return "veryLike"
    if (impressions.likes.usernames.includes(username))
      return "like"
    if (impressions.dislikes.usernames.includes(username))
      return "dislike"
    if (impressions.veryDislikes.usernames.includes(username))
      return "veryDislike"
    return "none"
  }

  const [postData, setPostData] = useState({
      postText: "",
      postDisplayedName: "",
      postUsername: "",
      postReceivers: [],
      postVeryLikesCounter: 0,
      postLikesCounter: 0,
      postDislikesCounter: 0,
      postVeryDislikesCounter: 0,
      postImpressionChosen: "",
      postViews: 0
  });

  /* viene modificata solo in handleImpressions
  solo in quella funzione c'è il controllo che i non loggati non possono reagire */
  const [chosenReaction, setChosenReaction] = useState("none")

  let postTextLength = 0;

  useEffect(() => {
      loadPostData(postId);
      sendReaction('view')
  }, [])

      /* queste cose sono dentro uno useEffect invece che dentro handleImpressions
      a causa del comportamento degli stati in React: per poter vedere il nuovo
      valore di uno stato, bisogna aspettare che il componente venga ri-renderizzato
      quindi svolgere queste azioni all'interno della stessa funzione in cui si
      aggiorna lo stato causa il loro svolgimento col valore precedente dello stato.
      metterle qui dentro ci assicura che lo stato sia effettivamente aggiornato */
  useEffect(() => {
    sendReaction(chosenReaction)

    let updatedPostData = {...postData}
    switch(chosenReaction) {
      case "veryLike":
        updatedPostData.postVeryLikesCounter += 1
        break
      case "like":
        updatedPostData.postLikesCounter += 1
        break
      case "dislike":
        updatedPostData.postDislikesCounter += 1
        break
      case "veryDislike":
      updatedPostData.postVeryDislikesCounter += 1
      break
    }
    updatedPostData.postImpressionChosen = chosenReaction
    setPostData(updatedPostData)
  }, [chosenReaction])

  postTextLength = postData.postText.length;

  const handleImpressions = (impression:string) => {
    if (!isLoggedIn) {
      //TODO: togliere questo alert e fare un popup un pelo più carino
      alert("devi loggarti per reagire ai post!")
      return 
    }
    try{
      const prevChosenReaction = chosenReaction
      setChosenReaction(impression)

      /* decrementa valore vecchio. solo visuale: i dati del post vengono scaricati
      solo quando il post renderizza (vedi useEffect lassù)
      idem per lo switch nello useEffect con dipendenza [chosenReaction]
      l'aggiornamento del database viene fatto contemporaneamente ma in un'altra funzione: sendReaction */
      let updatedPostData = {...postData}
      switch(prevChosenReaction) {
        case "veryLike":
          updatedPostData.postVeryLikesCounter -= 1
          break
        case "like":
          updatedPostData.postLikesCounter -= 1
          break
        case "dislike":
          updatedPostData.postDislikesCounter -= 1
          break
        case "veryDislike":
        updatedPostData.postVeryDislikesCounter -= 1
        break
      }
      setPostData(updatedPostData)
    }
    catch(e){
      console.log(e)
    }
  }

  return (
      <div className="post">
          <div className="postWrapper">
              <div className="postTop">
                  <Stack direction="horizontal">
                      <img 
                          width={35}
                          className="rounded-circle"
                          src={`${userDetails.userImage}`}
                          alt="" 
                      />
                      <span className="p-2">{postData.postDisplayedName}</span>
                      <span className="p-2 text-secondary">{postData.postUsername}</span>
                      <Button className="btn-transparent">
                        <span className="p-2">{postData.postReceivers[0] ?? "nullo"}</span>
                      </Button>
                  </Stack>
                  <div className="postTopRight">
                      <span className="postCharUsed">{postTextLength}</span>
                      {/* <VDots /> */}
                  </div>
              </div>
              <div className="postCenter text-break">
                  <span className="postText">{postData.postText}</span>
                  <img className="postImg" src="/assets/post/2.jpg" alt="" />
              </div>
              <div className="postBottom">
                  <div className="postBottomLeft">
                    <ButtonGroup>
                      <Button
                      variant="dark"
                      onClick={()=>handleImpressions('veryLike')}
                      disabled={postData.postImpressionChosen == "veryLike"}
                      >
                        <Heart className="likeIcon" /> {postData.postVeryLikesCounter}
                      </Button>

                      <Button
                      variant="dark"
                      onClick={()=>handleImpressions('like')}
                      disabled={postData.postImpressionChosen == "like"}>
                        <Like className="likeIcon" /> {postData.postLikesCounter}
                      </Button>

                      <Button
                      variant="dark"
                      onClick={()=>handleImpressions('dislike')}
                      disabled={postData.postImpressionChosen == "dislike"}>
                        <Dislike className="likeIcon" /> {postData.postDislikesCounter}
                      </Button>

                      <Button
                      variant="dark"
                      onClick={()=>handleImpressions('veryDislike')}
                      disabled={postData.postImpressionChosen == "veryDislike"}>
                        <Heartbreak  className="likeIcon"/> {postData.postVeryDislikesCounter}
                      </Button>
                    </ButtonGroup>

                  </div>
                  <div className="postBottomRight">
                      <span className="postCommentText">{postData.postViews} Views</span>
                  </div>
              </div>
          </div>
      </div>
  )
}