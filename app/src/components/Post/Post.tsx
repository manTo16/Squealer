import "./post.scss"
import VDots from "../svg/VDotsSvg"
import propic from "../../assets/person/9.png"
import Like from "../svg/Reaction/LikeSvg"
import Heart from "../svg/Reaction/HeartSvg"
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import axios, { AxiosError } from "axios"
import { apiPostsURL, apiUsersURL } from "../../URLs"

import { MutableRefObject, useEffect, useRef, useState } from "react"
import { Collapse, Stack } from "react-bootstrap"
import { Button, Row, Col } from "react-bootstrap"
import Feed, { ReactionType } from "@components/Feed/Feed"
import PostPlaceholder from "./PostPlaceholder"
import Heartbreak from "@components/svg/Reaction/HeartbreakSvg"
import Dislike from "@components/svg/Reaction/DislikeSvg"
import Char from "@components/svg/CharSvg"
import Eye from "@components/svg/ViewsSvg"
import { useNavigate, useParams } from "react-router-dom"



export default function Post({postId = "defaultId"}: {postId?: string}) {
  const isLoggedIn = !!localStorage.getItem('token')
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  const navigate = useNavigate()

  const { id } = useParams<{ id?: string }>();

  const [isLoading, setIsLoading] = useState(true)  //considero caricato un post quando è tutto pronto tranne l'immagine dell'utente

  async function loadPostData(postId: string) {

    if (postId === 'getFromUrl') postId = id ?? ""

      try {
        const loadedPostData = await axios.get(apiPostsURL + `/${postId}`).then((response) => (response?.data));
        if (loadedPostData) {
          //const userImage = await getUserPropic(loadedPostData.username)
          const impressionAlreadyChosenByUser = getImpressionFromUser(loadedPostData.impressions)
          setPostData({
              postText: loadedPostData.text,
              postIsReplyTo: loadedPostData.replyTo,
              postReplies: loadedPostData.replies,
              postDisplayedName: loadedPostData.displayName,
              postUsername: loadedPostData.username,
              userImg: "",
              postCreationDate: loadedPostData.creationDate.toLocaleString().split('T')[0],  //dopo la T ci sono ora, minuto e secondi. si possono tenere anche quelle informazini se vogliamo
              postReceivers: loadedPostData.receivers,
              postVeryLikesCounter: loadedPostData.impressions.veryLikes.number,
              postLikesCounter: loadedPostData.impressions.likes.number,
              postDislikesCounter: loadedPostData.impressions.dislikes.number,
              postVeryDislikesCounter: loadedPostData.impressions.veryDislikes.number,
              postImpressionChosen: impressionAlreadyChosenByUser,
              postViews: loadedPostData.impressions.views.number
          })
          setIsLoading(false)
          //console.log("POST LOADEDPOSTDATA.USERNAME: ", loadedPostData.username)
  
          const userImage = getUserPropic(loadedPostData?.username ?? "").
          then((userImage) => {
            //console.log("AAAAAAAAAAAAAAAA")
            setPostData({
              postText: loadedPostData.text,
              postIsReplyTo: loadedPostData.replyTo,
              postReplies: loadedPostData.replies,
              postDisplayedName: loadedPostData.displayName,
              postUsername: loadedPostData.username,
              userImg: userImage ?? "",
              postCreationDate: loadedPostData.creationDate.toLocaleString().split('T')[0],  //dopo la T ci sono ora, minuto e secondi. si possono tenere anche quelle informazini se vogliamo
              postReceivers: loadedPostData.receivers,
              postVeryLikesCounter: loadedPostData.impressions.veryLikes.number,
              postLikesCounter: loadedPostData.impressions.likes.number,
              postDislikesCounter: loadedPostData.impressions.dislikes.number,
              postVeryDislikesCounter: loadedPostData.impressions.veryDislikes.number,
              postImpressionChosen: impressionAlreadyChosenByUser,
              postViews: loadedPostData.impressions.views.number
          })
            //console.log("POST POSTDATA AGGIORNATO CON PROPIC: ", userImage)
          })
  
        }
      } catch (error) {
        if (error instanceof Error && 'response' in error) {
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.status === 404) {
            console.log("Post loadPostData 404 con postId ", postId);
            // Gestisci l'errore 404 come preferisci, ad esempio mostrando un messaggio all'utente
            setIsLoading(false);
          } else {
            // Se l'errore non è un 404, rilancia l'errore
            throw error;
          }
        }
      }
  }

  function generateAddressURL(address: string) {
    let URLstring = ""
    switch(address[0]) {
      case "§":
        URLstring = `/channels/${address.slice(1)}`
        break
      case "@":
        URLstring = `/users/${address.slice(1)}`
        break
      default:
        break
    }
    return URLstring
  }

  const [showReceivers, setShowReceivers] = useState(false)

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
      postIsReplyTo: "",
      postReplies: [],
      postDisplayedName: "",
      postUsername: "",
      userImg: "",
      postCreationDate: "",
      postReceivers: [],
      postVeryLikesCounter: 0,
      postLikesCounter: 0,
      postDislikesCounter: 0,
      postVeryDislikesCounter: 0,
      postImpressionChosen: "",
      postViews: 0
  });

  async function getUserPropic (username: string) {
    //console.log("Post getUserPropic parte richiesta: ",apiUsersURL+`/${username}/propic`)
    const response = await axios.get(apiUsersURL+`/${username}/propic`)
    //console.log("Post getUserPropic risposta richiesta: ", response)
    let userImage = ''
    if (response && response.status == 200) 
      userImage = response.data
    return userImage
  }

  /* viene modificata solo in handleImpressions
  solo in quella funzione c'è il controllo che i non loggati non possono reagire */
  const [chosenReaction, setChosenReaction] = useState("none")

  let postTextLength = 0;

  useEffect(() => {
      loadPostData(postId)
      if (postData.postUsername) sendReaction('view')
  }, [])

      /* queste cose sono dentro uno useEffect invece che dentro handleImpressions
      a causa del comportamento degli stati in React: per poter vedere il nuovo
      valore di uno stato, bisogna aspettare che il componente venga ri-renderizzato
      quindi svolgere queste azioni all'interno della stessa funzione in cui si
      aggiorna lo stato causa il loro svolgimento col valore precedente dello stato.
      metterle qui dentro ci assicura che lo stato sia effettivamente aggiornato */
  useEffect(() => {
    if (chosenReaction != ReactionType.Default) sendReaction(chosenReaction)

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

  const [showShowRepliesButton, setShowShowRepliesButton] = useState(false) //lo so fa ridere

  const handleRepliesNumber = (numberOfReplies: number) => {
    //console.log("Post numero risposte: ", numberOfReplies)
    setPostRepliesNumber(numberOfReplies)
    if (numberOfReplies === 0) setShowShowRepliesButton(false)
    else setShowShowRepliesButton(true)
  }

  const [showReplies, setShowReplies] = useState(false)

  const [postRepliesNumber, setPostRepliesNumber] = useState(0)

  const mentionsRegex = /([@][a-zA-Z0-9]+)|[§]([a-z0-9]+|[A-Z0-9]+)/g;
  const postTextArray = postData.postText.split(' ');

  if (isLoading) return (<PostPlaceholder />)

  return (
      <div className="post">
          <div className="postWrapper">
              <Row>
                  <Col>
                      <img 
                          width={35}
                          className="rounded-circle"
                          src={`${postData.userImg}`}
                          alt="" 
                      />
                      <span className="p-2">{postData.postDisplayedName}</span>
                      <span className="p-2 text-secondary">{postData.postUsername}</span>
                      <Button className="outline-secondary" variant="outline-secondary" size="sm">
                        <span className="p-0 showReceiversButton"
                        onClick={() => setShowReceivers(!showReceivers)}>{showReceivers ? ("Post") : ("Destinatari")}</span>
                      </Button>
                      <span>
                        <Button onClick={() => navigate(`/newPost/reply/${postId}`)}>
                          rispondi al post
                        </Button>
                      </span>
                  </Col>
                  <Col xs="auto" sm="auto" lg="auto" md="auto">
                    <Stack direction="vertical" gap={1}>
                      <div className="d-flex justify-content-end">
                        <span>{postTextLength}</span>
                        <Char className="mx-1 align-self-center" height='24px'/>
                      </div>
                      <div className="d-flex justify-content-end">
                        <span className="d-flex justify-content-end">{postData.postViews}</span>
                        <Eye className="mx-1 align-self-center" height='24px'/>
                      </div>
                    </Stack>
                  </Col>
              </Row>
              <div className="postCenter text-break">
                {showReceivers ?
                (
                  <div className="postReceivers d-flex flex-wrap">
                    {postData.postReceivers.map((str, index) => (
                      <div key={index} className="p-2 flex-fill">
                        <Button variant="dark" href={generateAddressURL(str)}>{str}</Button>
                      </div>
                    ))}
                  </div>
                )
                :
                (
                  <span className="postText">
                  {postTextArray.map((word, index) => {
                      if (mentionsRegex.test(word)) {
                          // Resetta l'espressione regolare
                          mentionsRegex.lastIndex = 0;
                          return (
                              <Button key={index} variant="dark" href={generateAddressURL(word)}>
                                  {word}
                              </Button>
                          );
                      } else {
                          return word + ' ';
                      }
                  })}
                  </span>
                )
                }
              </div>
              <Row>
                <Col>
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
                  </Col>
                  <Col  xs="auto" sm="auto" lg="auto" md="auto">
                    <Stack direction="vertical" gap={0}>
                      <div className="d-flex justify-content-end">
                        <p className="mb-1">{postData.postCreationDate}</p>
                      </div>
                        <span>
                          { showShowRepliesButton &&
                          <Button 
                            variant="outline-light" 
                            size="sm" 
                            onClick={() => setShowReplies(!showReplies)}>
                              {showReplies ? "Nascondi risposte" : `Mostra ${postRepliesNumber} rispost${postRepliesNumber === 1 ? `a` : `e`}`}
                          </Button>
                          }
                        </span>
                    </Stack>
                </Col>
              </Row>
          </div>
          <Collapse in={showReplies} mountOnEnter={false}>
            <div style={{borderLeft: "5px solid gray"}}>

            <div>risposte</div>
            <div><Feed postRepliesId={(postId === 'getFromUrl' ? id : postId)} handleNumberOfReplies={handleRepliesNumber}></Feed></div>
            </div>
          </Collapse>
      </div>
  )
}