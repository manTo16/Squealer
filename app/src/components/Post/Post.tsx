import Like from "../svg/Reaction/LikeSvg"
import Heart from "../svg/Reaction/HeartSvg"
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import axios, { AxiosError } from "axios"
import { apiPostsURL, apiUsersURL } from "../../URLs"

import './post.css';
import React, { useRef } from "react";
import { useContext, useEffect, useState } from "react"
import { Collapse, Stack } from "react-bootstrap"
import { Button, Row, Col } from "react-bootstrap"
import Feed, { ReactionType } from "@components/Feed/Feed"
import PostPlaceholder from "./PostPlaceholder"
import Heartbreak from "@components/svg/Reaction/HeartbreakSvg"
import Dislike from "@components/svg/Reaction/DislikeSvg"
import Char from "@components/svg/CharSvg"
import Eye from "@components/svg/ViewsSvg"
import { Link, useNavigate, useParams } from "react-router-dom"
import Answer from "@components/svg/AnswerSvg";

import { generateAddressURL } from "@utils/URLs"
import { UserContext } from "@utils/userData";
import { addViewedPost, alreadyViewed } from "@utils/guestUsers";
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Figure from 'react-bootstrap/Figure';
import logo from "../../assets/Squealer.png"
import Map from "@components/Geolocation/map";

import { UserDetailsInterface } from "@utils/userData";


function Post({postId = ""}: {postId?: string}) {
  const isLoggedIn = !!localStorage.getItem('token')
  //const defaultValue = {}
  //const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext) as { userDetails: UserDetailsInterface, fetchUserData: Function, updateUserDataFromLS: Function }
  const navigate = useNavigate()

  const observedDivRef = useRef<HTMLDivElement | null>(null)

  const { id } = useParams<{ id?: string }>();

  const [isLoading, setIsLoading] = useState(true)  //considero caricato un post quando è tutto pronto tranne l'immagine dell'utente

  const [isPostBodyAnImg, setIsPostBodyAnImg] = useState(false);
  const [isPostBodyAGeolocation, setIsPostBodyAGeolocation] = useState(false);
  const [isArea, setIsArea] = useState(false);
  const [isPostBodyAVideo, setIsPostBodyAVideo] = useState(false);

  async function loadPostData(postId: string) {    

    if (postId === 'getFromUrl') postId = id ?? ""

    try {
        const loadedPostData = await axios.get(apiPostsURL + `/${postId}`).then((response) => (response?.data));
        if (loadedPostData) {
            const impressionAlreadyChosenByUser = getImpressionFromUser(loadedPostData.impressions)
            setChosenReaction(impressionAlreadyChosenByUser)

            let postCreationDate: string;
            const now = new Date();
            const creationDate = new Date(loadedPostData.creationDate);
            const diffInMinutes = Math.floor((now.getTime() - creationDate.getTime()) / 60000);

            if (diffInMinutes < 60) {
                postCreationDate = `${diffInMinutes} minuti fa`;
            } else if (diffInMinutes < 1440) {
                const diffInHours = Math.floor(diffInMinutes / 60);
                postCreationDate = `${diffInHours} ore fa`;
            } else {
                postCreationDate = creationDate.toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'short' }).replace(/\. /g, ' | ');
            }

            setPostData({
                postText: loadedPostData.text,
                postIsReplyTo: loadedPostData.replyTo,
                postReplies: loadedPostData.replies,
                postDisplayedName: loadedPostData.displayName,
                postUsername: loadedPostData.username,
                userImg: "",
                postCreationDate: postCreationDate,
                postReceivers: loadedPostData.receivers,
                postVeryLikesCounter: loadedPostData.impressions.veryLikes.number,
                postLikesCounter: loadedPostData.impressions.likes.number,
                postDislikesCounter: loadedPostData.impressions.dislikes.number,
                postVeryDislikesCounter: loadedPostData.impressions.veryDislikes.number,
                postImpressionChosen: impressionAlreadyChosenByUser,
                postViews: loadedPostData.impressions.views.number
            })

          if (isBase64Image(loadedPostData.text)) {  // se è un'immagine
            setIsPostBodyAnImg(true);
          }

          if (isBase64Video(loadedPostData.text)) {
            setIsPostBodyAVideo(true)
          }
          
          if (isCoordinates(loadedPostData.text)) { // se è una geolocalizzazione
            if (isArea) { 
              loadedPostData.text = loadedPostData.text.slice(0, -4);
            }
            setIsPostBodyAGeolocation(true);
          }

          setIsLoading(false)
          //console.log("POST LOADEDPOSTDATA.USERNAME: ", loadedPostData.username)
  
          const userImage = getUserPropic(loadedPostData?.username ?? "")
          .then((userImage) => {
              
              let postCreationDate: string;
              const now = new Date();
              const creationDate = new Date(loadedPostData.creationDate);
              const diffInMinutes = Math.floor((now.getTime() - creationDate.getTime()) / 60000);

              if (diffInMinutes < 60) {
                  postCreationDate = `${diffInMinutes} minuti fa`;
              } else if (diffInMinutes < 1440) {
                  const diffInHours = Math.floor(diffInMinutes / 60);
                  postCreationDate = `${diffInHours} ore fa`;
              } else {
                  postCreationDate = creationDate.toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'short' }).replace(/\. /g, ' | ');
              }

              setPostData({
                  postText: loadedPostData.text,
                  postIsReplyTo: loadedPostData.replyTo,
                  postReplies: loadedPostData.replies,
                  postDisplayedName: loadedPostData.displayName,
                  postUsername: loadedPostData.username,
                  userImg: userImage ?? "",
                  postCreationDate: postCreationDate,
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

  function isCoordinates(str: string): boolean {
    const regex = /^((-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)[+]?)+|area$/;
    if (str.endsWith('area')) {
      setIsArea(true);
    }
    return regex.test(str);
  }

  function isBase64Image(str: string) {
    return str.startsWith('data:image/');
  }

  function isBase64Video(str: string) {
    return str.startsWith('data:video/');
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
    const response = await axios.get(apiUsersURL+`/${username}/propic-32`)
    //console.log("Post getUserPropic risposta richiesta: ", response)
    let userImage = ''
    if (response && response.status === 200) 
      userImage = response.data
    return userImage
  }

  /* viene modificata solo in handleImpressions 
  e in loadPostData per far sì che i counter vengano decrementati correttamente anche al primo caricamento della pagina nel caso in cui sia già stato messo like ad un post
  solo in quella funzione c'è il controllo che i non loggati non possono reagire */
  const [chosenReaction, setChosenReaction] = useState("none")

  let postTextLength = 0;

  //garantisce che le visualizzazioni vengano mandate solo quando il post entra nel viewport
  useEffect(() => {
    if (!isLoading) {
      const options = {
        root: null,
        threshold: 1.0
      }

      const observer = new IntersectionObserver((entities) => {
        const target = entities[0];
          if (target.isIntersecting) { 
            
            //sloggato
            if (!isLoggedIn) {
              if (!alreadyViewed(postId)) {
                addViewedPost(postId)
                sendReaction('view')
              }
            }
            
            //loggato
            else if (isLoggedIn && postId && !userDetails.impressedPostIds.views.includes(postId)) sendReaction('view')
            
          }
      }, options)
    
      if (observedDivRef.current) {
        observer.observe(observedDivRef.current)
      }
    
      // pulizia quando il componente viene smontato
      return () => {
        if (observedDivRef.current) {
          observer.unobserve(observedDivRef.current);
        }
      }
    }
  }, [isLoading]); 

  useEffect(() => {
      if (!postData.postText && postId) loadPostData(postId)
  }, [postData])

      /* queste cose sono dentro uno useEffect invece che dentro handleImpressions
      a causa del comportamento degli stati in React: per poter vedere il nuovo
      valore di uno stato, bisogna aspettare che il componente venga ri-renderizzato
      quindi svolgere queste azioni all'interno della stessa funzione in cui si
      aggiorna lo stato causa il lo  function isBase64Image(str: string) {
    return str.startsWith('data:image/');
  }ra che lo stato sia effettivamente aggiornato */
  useEffect(() => {
    if (chosenReaction !== ReactionType.Default) sendReaction(chosenReaction)

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

  if (isPostBodyAnImg || isPostBodyAGeolocation || isPostBodyAVideo) {
    postTextLength = 125;
  } else {
    postTextLength = postData.postText.length;
  }

  const [showModal, setShowModal] = useState(false);

  const handleImpressions = (impression:string) => {
    if (!isLoggedIn) {
      //TODO: togliere questo alert e fare un popup un pelo più carino
      setShowModal(true);
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

  const mentionsRegex = /^@[a-zA-Z0-9-._]+$|^§([a-z0-9-]+|[A-Z0-9-]+)$|^#[a-zA-Z0-9-_]+$/; //questa deve rimanere uguale a addressRegex nel backend. se cambiate una cambiate anche l'altra
  const urlRegex = /^(((http|https):\/\/)|[www.])[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/;
  const postTextArray = postData.postText.split(/\s|\n/);

  if (isLoading) return (<PostPlaceholder />)

  return (
    <>
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Accedi per reagire a questo squeal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Accedi a Squealer e inizia subito a squillare‼
        <img src={logo} alt="logo" className="squeal d-block mx-auto my-3" width="100px" height="100px"/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={() => {setShowModal(false); navigate('/register')}}>
          Registrati
        </Button>
        <Button variant="success" onClick={() => {setShowModal(false); navigate('/login')}} >
          Log in
        </Button>
      </Modal.Footer>
    </Modal>
    <div ref={observedDivRef} className="w-100 border-bottom border-3 border-dark" style={{backgroundColor: '#1a1a1b'}}>
      <div className="p-2">
        <Row>
          <Col className="align-self-top">
            <div className="d-inline-flex flex-row align-self-center">
              <Button 
                onClick={() => navigate(`/users/${postData.postUsername}`)}
                className="text-decoration-none text-white btn btn-dark postInfo p-1">
                <img 
                  width={25}
                  className="rounded-circle"
                  src={`${postData.userImg}`}
                  alt="profile pic" 
                />
                <div className="d-inline-flex flex-column text-wrap mx-1">
                  <span>
                    {postData.postDisplayedName}
                    <span className="text-secondary mx-1">
                      @{postData.postUsername}
                    </span>
                  </span>
                </div>
              </Button> 
            </div>
            <Button className="btn btn-dark postInfo py-2 mx-1" size="sm" disabled={postData.postReceivers.length === 0}>
              <span className="p-0 showReceiversButton"
              onClick={() => setShowReceivers(!showReceivers)}>{showReceivers ? ("Post") : ("Destinatari")}</span>
            </Button>        
            <Button className="btn btn-dark postInfo" onClick={() => navigate(`/newPost/reply/${postId}`)}>
              <Answer/>
            </Button>
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
        
        {/* ho allargato il padding per i post testuali perchè mi sembrava più carino */}
        <div className={`${isPostBodyAnImg || isPostBodyAVideo || isPostBodyAGeolocation ? `py-2 pb-3` : `pt-4 pb-4`} text-break`}>
          {
            showReceivers ? 
              (
                <div className="postReceivers d-flex flex-wrap">
                  {postData.postReceivers.map((str, index) => (
                    <div key={index} className="p-2 flex-fill">
                      <Button variant="dark" onClick={() => navigate(generateAddressURL(str))}>{str}</Button>
                    </div>
                  ))}
                </div>
              ) : isPostBodyAnImg ? (
                <div className="d-flex align-items-center justify-content-center bg-black rounded">
                <Figure className="m-0">
                <Figure.Image
                  width="100%"
                  height={180}
                  alt="post image"
                  className="m-0"
                  src={`${postData.postText}`}
                />
                </Figure>
                </div>
              ) : isPostBodyAVideo ? (
                <div className="d-flex align-items-center justify-content-center bg-black rounded">
                <video controls src={postData.postText} className="w-100"></video>
                </div>
              ) : isPostBodyAGeolocation ? (
                <>
                  <Map 
                    coordinates={postData.postText}
                    isArea={isArea} 
                  />
                </>
              ) : (
                <span className="postText">
                {postTextArray.map((word, index) => {
                  if (mentionsRegex.test(word)) {
                      // Resetta l'espressione regolare
                      mentionsRegex.lastIndex = 0;
                      return (<React.Fragment key={index}>
                          <Button variant="dark" onClick={() => {navigate(generateAddressURL(word))}}>
                              {word}
                          </Button><span> </span></React.Fragment>
                      );
                  } else if (urlRegex.test(word)) {
                      // Resetta l'espressione regolare
                      urlRegex.lastIndex = 0;
                      return (<React.Fragment key={index}>
                          <Link to={word.startsWith("http") ? word : `https://${word}`}>
                              {word}
                          </Link> <span> </span></React.Fragment>
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
                className="rotate-animation"
                variant="dark"
                onClick={()=>handleImpressions('veryLike')}
                disabled={postData.postImpressionChosen === "veryLike"}
              > 
                <Heart style={{width: '24px', height: '24px'}} /> {postData.postVeryLikesCounter}
              </Button>

              <Button
                className="swing-animation"
                variant="dark"
                onClick={()=>handleImpressions('like')}
                disabled={postData.postImpressionChosen === "like"}
              >
                <Like style={{width: '24px', height: '24px'}} /> {postData.postLikesCounter}
              </Button>

              <Button
                className="jump-animation"
                variant="dark"
                onClick={()=>handleImpressions('dislike')}
                disabled={postData.postImpressionChosen === "dislike"}
              >
                <Dislike style={{width: '24px', height: '24px'}} /> {postData.postDislikesCounter}
              </Button>

              <Button
                className="shake-animation"
                variant="dark"
                onClick={()=>handleImpressions('veryDislike')}
                disabled={postData.postImpressionChosen === "veryDislike"}
              >
                <Heartbreak style={{width: '24px', height: '24px'}} /> {postData.postVeryDislikesCounter}
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

        <div className="mx-1">risposte</div>
        <div><Feed postRepliesId={(postId === 'getFromUrl' ? id : postId)} handleNumberOfReplies={handleRepliesNumber} /></div>
        </div>
      </Collapse>
    </div>
    </>
  )
}

export default Post;