import { useNavigate, useParams } from "react-router-dom";
import axios from '@root/axiosConfig'
import { AxiosError } from "axios";
import { apiPostsURL, apiUsersURL } from "../URLs";

import React, { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CardFooter from 'react-bootstrap/CardFooter'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card';
import { Accordion, Stack } from "react-bootstrap";

import ReceiverInputField from "@components/newPost/ReceiverInputField";
import CardBody from "@components/newPost/CardBody";
import Post from "@components/Post/Post";

import Video from "@components/svg/VideoSvg";
import LocationButton from "@components/svg/LocationSvg";
import Media from "@components/svg/MediaSvg";
import Text from "@components/svg/TextSvg";
import Add from "@components/svg/AddSvg";
import Remove from "@components/svg/RemoveSvg";
import IconPaste from "@components/svg/PasteSvg";
import IconUpload from "@components/svg/UploadSvg";
import IconCamera from "@components/svg/CameraSvg";
import { getPersonalUserData } from "@utils/userData";


export default function NewPostPage() {
  const defaultValue = {}
  const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  const userToken = localStorage.getItem("token") ?? "";

  const { replyPostId } = useParams<{ replyPostId?: string }>();
  
  
  var Dchar = 1024;

  const [text,setText] = useState("");
  const [receivers, setReceivers] = useState<string[]>([""]);
  const [nReceivers, setNReceivers] = useState(0);

  const [charCount, setCharCount] = useState(0);

  const [textLines, setTextLines] = useState(1);  // !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const calculateNumberOfTextLines = (textarea: HTMLElement) => { // !!!
    return Math.floor(textarea.scrollHeight/parseInt(getComputedStyle(textarea).lineHeight) );
  }

  const navigate = useNavigate()

  useEffect(() => {
    //if not logged in, redirects to login page
    if(!userToken) {
      navigate("/login");
    }
    else {
      if (replyPostId) {
        setReplyTo(replyPostId)

        const fetchReplyToReceivers = async () => {
          const receiversArray = await getReplyToReceivers(replyPostId)
          console.log("NewPost useEffect fetchReplyToReceivers receiversArray: ", receiversArray)
          setNReceivers(receiversArray?.length ?? 0)
          setReceivers(receiversArray ?? [])
        }
        fetchReplyToReceivers()
      }

      (async () => {
        await getPersonalUserData(userDetails.username)
        setDisplayDailyChars(userDetails.dailyChar)
        setDisplayWeeklyChars(userDetails.weeklyChar)
        setDisplayMonthlyChars(userDetails.monthlyChar)
      })()
    }
  }, [])

  //calcola le linee da assegnare al componente ponendoci un limite, impostato in modo che la textarea non occupi più di metà schermo
  const getTextLines = (textarea: HTMLTextAreaElement) => {
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    
    //a volte l'altezza di default della linea di scrittura della textarea è >= 24*2 e questa funzione non va bene
    if (lineHeight > 40) return 12
    //const maxHeight = textarea.parentElement?.clientHeight;  //non funziona, il componente cardbody si allunga dinamicamente
    const maxHeight = window.innerHeight / 3
    
    const maxLines = Math.floor(maxHeight / lineHeight);
    
    const lines = calculateNumberOfTextLines(textarea);
    return Math.min(lines, maxLines);
  }
  
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    setCharCount(inputText.length);
    setText(inputText)
    setTextLines(getTextLines(event.target));
  };

  const handleReceiverInputChange = (event: React.ChangeEvent<HTMLInputElement>, receiversArrayIndex: number, receiverType: string) => {
    const inputText = receiverType + event.target.value;
    
    /* aggiorna l'array di destinatari modificando solo l'indice corrispondente al campo modificato */
    setReceivers(receivers => receivers.map((receiver, index) =>
      index === receiversArrayIndex-1 ? inputText : receiver));
    console.log("destinatario: ", inputText) //DEBUG
  }

  const handleSubmit = async (event:React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    console.log('sei qui')
    try{
      const response = await axios.post(apiPostsURL,
        {userId: userDetails._id,text, receivers},
        { headers: {"Authorization": `Bearer ${userToken}`}}
        ).then((response) => {
          if (replyTo) axios.put(`${apiPostsURL}/${replyTo}/replies`,
                                            {replyPostId: response.data})
        })
        .then(() => {
          //toglie caratteri utente dal database
          axios.patch(apiUsersURL+'/'+userDetails.username+'/characters',
                            {daily: -charCount, weekly: -charCount, monthly: -charCount})
        })
        .then(() => {
          //aggiorna dati utente in locale
          axios.get(apiUsersURL+'/'+userDetails.username).then(response => response.data).then(userData => localStorage.setItem('user',JSON.stringify(userData)))
        })
        .then(()=>{
          alert('Post created')
          navigate('/')
        })
      //window.location.reload();
      console.log("receivers: ", receivers)  //DEBUG
    }
    catch(err){
      console.log(err)
    }
  }

  const handleAddReceivers = () => {
    if (nReceivers<=100) {
      setNReceivers(nReceivers+1);
      setReceivers((prev) => [...prev, ""])
    }
    console.log(receivers)
  }

  const handleRemoveReceivers = () => {
    if (nReceivers>0){
      setNReceivers(nReceivers-1);
      setReceivers(receivers.slice(0, -1))
    }
    console.log(receivers)
  }

  const [replyTo, setReplyTo] = useState("")

  const renderReplyPost = (replyPostId: string) => {
    try {
      return <Post postId={replyPostId} />;
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          console.log("NewPost renderReplyPost 404 con replyPostId ", replyPostId);
        } else {
          throw error;
        }
      }
      return null;
    }
  }

  const getReplyToReceivers = async (postId: string) => {
    try {
      const receiversArray = await axios.get(apiPostsURL+`/${postId}/receivers`)
      .then((response) => {
        if (response && response.status === 200) {
          console.log("NewPost getReplyToReceivers response.data: ", response.data)
          return response.data
        }
        else return []
      })
      return receiversArray
    }

    catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          console.log("NewPost getReplyToReceivers 404 con postId ", postId);
        } else {
          throw error;
        }
      }
      return []
    }

    /*
    nella prima interfaccia per rispondere bisognava mettere l'id del post a cui rispondere.
    salvo il codice della barra di input per fare prima caso mai volessi rimetterlo per provare
    <input type="text" placeholder="metti l'id del post" onChange={(e) => setReplyTo(e.target.value)} value={replyTo}/>  
    non è possibile rimetterlo perchè ora il post visualizzato sotto (quello a cui si risponde) viene
    caricato al caricamento della pagina usando l'id nell'url e non viene più aggiornato
    quindi caso mai si volesse rimettere sta cosa andrebbero cambiate due o tre cosette
    se va tutto bene comunque non la rimetteremo mai più questa barra in realtà quindi tutto questo commento si può ignorare
    */

  }

  const [displayDailyChars, setDisplayDailyChars] = useState(0)
  const [displayWeeklyChars, setDisplayWeeklyChars] = useState(0)
  const [displayMonthlyChars, setDisplayMonthlyChars] = useState(0)


  const[Type, setType] = useState('txt');
  
  const handleType = (eventKey: string | null) => {
    if (eventKey === null) return;
    setType(eventKey);
  };

  return(
    <Container>
      <Row>
        <p>Quota giornaliera: {userDetails.dailyChar} {userDetails.dailyChar - charCount}</p>
        <p>Quota settimanale: {userDetails.weeklyChar} {userDetails.weeklyChar - charCount}</p>
        <p>Quota mensile: {userDetails.monthlyChar} {userDetails.monthlyChar - charCount}</p>
        {
          userDetails.debtChar > 0 ?
          (
            <>
            <Accordion>
              <Accordion.Item eventKey="1">
                <div style={{backgroundColor: "#dc3545"}}>
                <Accordion.Header>
                ATTENZIONE: hai accumulato del debito di caratteri!
                </Accordion.Header>
                </div>
                <Accordion.Body>
                <p>attualmente, devi acquistare {userDetails.debtChar} caratteri per postare</p>
                <p>in alternativa, puoi aspettare la prossima paghetta di caratteri</p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  Comprare caratteri necessari
                </Accordion.Header>
                <Accordion.Body>
                  per poter postare di nuovo, dirigiti al <Button onClick={() => navigate("/charShop")}>negozio di caratteri</Button> e sana il tuo debito
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            
            </>
          ) :
          ( userDetails.dailyChar - charCount <= 0 || userDetails.weeklyChar - charCount <= 0 || userDetails.monthlyChar - charCount <= 0 ?
            (
              <Accordion>
              <Accordion.Item eventKey="1">
                <div style={{backgroundColor: "#dc3545"}}>
                <Accordion.Header>
                ATTENZIONE: hai esaurito i caratteri!
                </Accordion.Header>
                </div>
                <Accordion.Body>
                Se decidi di pubblicare comunque il tuo squeal, andrai in debito di {charCount - Math.min(userDetails.dailyChar, userDetails.weeklyChar, userDetails.monthlyChar)} caratteri. 
                Ciò significa che non potrai pubblicare altri squeal finchè il tuo debito non sarà risanato!
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>
                  Comprare caratteri
                </Accordion.Header>
                <Accordion.Body>
                  Per poter acquistare nuovi caratteri, puoi dirigerti al <Button onClick={() => navigate("/charShop")}>negozio di caratteri</Button> e acquistarne quanti desideri.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  Attendere prossimo reset quota
                </Accordion.Header>
                <Accordion.Body>
                  <p>In alternativa, puoi aspettare che la tua quota di caratteri venga ricolmata domani / prossima settimana / mese prossimo.</p>
                  <p>Ma dovresti aspettare. In alternativa, puoi <Button onClick={() => navigate("/charShop")}>spendere tutti i tuoi risparmi!</Button></p>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="4">
                <Accordion.Header>
                  Caratteri premio 
                </Accordion.Header>
                <Accordion.Body>
                  <p>Sapevi che se i tuoi post diventano popolari, ricevi caratteri da poter usare per pubblicare nuovi squeal?</p>
                  <p>Controlla lo stato dei tuoi post, o assumi un Social Media Manager per farlo al posto tuo. Chi sa, da un giorno all'altro, un tuo post potrebbe diventare virale.</p>
                  <p>Ma si sa, chi vive sperando muore cagando. <Button onClick={() => navigate("/charShop")}>Prendi ora in mano il tuo futuro!</Button></p>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            ) :
            (
              <></>
            )
          )
        }
      </Row>

      <Row className="justify-content-md-center">
        <Col xs={12} g={{ span: 6, offset: 3 }}>
          <Card bg='dark' text='white'>
            <Card.Header>
            <div className="tags">
              <Stack direction="horizontal" gap={2}>
                <img src={`${userDetails.userImage}`} alt="user profile picture" width={50} className="rounded-circle"/>
                <span className="p-2 displayedName">{userDetails.displayName}</span>
                <span className="p-2 tagName">{'@'+userDetails.username}</span>
                <span>{charCount}</span>
              </Stack>
            </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <Stack direction="horizontal" gap={3}>
                  <span>Destinatari: {nReceivers}</span>
                  <ButtonGroup className="ms-auto" aria-label="Basic example">
                    <Button 
                      className="btn-transparent"
                      disabled={nReceivers>100 || (replyPostId ? true : false)}
                      onClick={handleAddReceivers}>
                    <Add/></Button>
                    <Button
                      className="btn-transparent"
                      disabled={nReceivers<1 || (replyPostId ? true : false)}
                      onClick={handleRemoveReceivers}>
                    <Remove/></Button>
                  </ButtonGroup>
                </Stack> 
              </Card.Text>
              
              <div className="d-flex flex-wrap">
              {replyPostId ?
              receivers.map((receiver) => (
                <p>{receiver}</p>
              ))
              :
              [...Array(nReceivers)].map((_, i) => (
                <ReceiverInputField key={i} 
                _inputField={i + 1} 
                handleReceiverInputChange={handleReceiverInputChange} 
                />
              ))}
              </div>

              <hr/>
              
              <Card.Text>
                <CardBody
                  type={Type}
                  onInputChange={handleInputChange}
                  charCount={charCount}
                  textLines={textLines}
                  Dchar={Dchar}
                  txtReadOnly={userDetails.debtChar > 0}
                />
              </Card.Text>

              <CardFooter>
                <Stack direction="horizontal" gap={3}>
                <ButtonGroup defaultValue={1}>
                  <Button
                    className="btn btn-secondary"
                    onClick={() => handleType('txt')}
                    id="postType-Txt"
                    value={1}
                  >
                    <Text />
                  </Button>
                  <DropdownButton as={ButtonGroup} title={<Media/>} id="bg-nested-dropdown" variant="secondary">
                    <Dropdown.Item 
                      className="btn btn-secondary"
                      onClick={() => handleType('pst')}
                    >
                      <IconPaste/>
                    </Dropdown.Item>
                    <Dropdown.Item 
                      className="btn btn-secondary"
                      onClick={() => handleType('upl')}
                    >
                      <IconUpload/>
                    </Dropdown.Item>
                    <Dropdown.Item 
                      className="btn btn-secondary"
                      onClick={() => handleType('cmr')}
                    >
                      <IconCamera/>
                    </Dropdown.Item>
                  </DropdownButton>
                  <Button
                    className="btn btn-secondary"
                    onClick={() => handleType('mp4')}
                    id="postType-vid"
                    value={3}
                  >
                    <Video />
                  </Button>
                  <Button
                    className="btn btn-secondary"
                    onClick={() => handleType('gps')}
                    id="postType-gps"
                    value={4}
                  >
                    <LocationButton />
                  </Button>
                </ButtonGroup>


                  <Button 
                  className="p-2 ms-auto btn-secondary"
                  onClick={handleSubmit}
                  disabled={userDetails.debtChar > 0 || charCount < 1}>
                    Squeal</Button>
                </Stack>
              </CardFooter>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <p>(questa interfaccia qua sotto si può migliorare. non saprei cos'altro aggiungere. ora come ora ti colleghi a questa pagina usando un url generato dal bottone rispondi al post nei post e l'unica cosa che cambia dal NewPost normale è che c'è il post qua sotto e i destinatari non si possono cambiare. a proposito, la grafica dei destinatari si può rifare. magari mettendoli in un grigiolino per far capire che non si possono cambiare. magari mettendoci dei bottoni cliccabili chi sa. stiamo comunque attenti al sistema di risposte. che per come è ora potrebbero uscire anche dei thread, che sarebbe carino)</p>
        <p>in risposta a:</p>
        
        
        {
          replyTo ?
          renderReplyPost(replyTo)
          :
          <></>
        }
      </Row>
    </Container>
  )  
}