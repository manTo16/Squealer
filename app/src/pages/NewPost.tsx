import { useNavigate, useParams } from "react-router-dom";
import axios from '@root/axiosConfig'
import { AxiosError } from "axios";
import { apiPostsURL, apiUsersURL } from "../URLs";

import React, { useContext, useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CardFooter from 'react-bootstrap/CardFooter'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container'
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card';
import { Accordion, Badge, Stack } from "react-bootstrap";

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
import { UserContext, getPersonalUserData } from "@utils/userData";
import DailyCalendar from "@components/svg/CharSvg/dCharSvg";
import MonthlyCalendar from "@components/svg/CharSvg/mCharSvg";
import WeeklyCalendar from "@components/svg/CharSvg/wCharSvg";
import Alert from 'react-bootstrap/Alert';
import AdvancedOptions from "@components/newPost/AdvancedOptions";

/*ERRORE IN CONSOLE
Warning: validateDOMNesting(...): <div> cannot appear as a descendant of <p>.
div
./node_modules/react-bootstrap/esm/ButtonGroup.js/_c<@http://localhost:3000/static/js/bundle.js:31782:105
div
./node_modules/react-bootstrap/esm/Stack.js/_c<@http://localhost:3000/static/js/bundle.js:36949:99
p
./node_modules/react-bootstrap/esm/CardText.js/_c<@http://localhost:3000/static/js/bundle.js:32323:102
div
./node_modules/react-bootstrap/esm/CardBody.js/_c<@http://localhost:3000/static/js/bundle.js:31929:102
div
./node_modules/react-bootstrap/esm/Card.js/_c<@http://localhost:3000/static/js/bundle.js:31858:98
div
./node_modules/react-bootstrap/esm/Col.js/_c<@http://localhost:3000/static/js/bundle.js:32540:14
div
./node_modules/react-bootstrap/esm/Row.js/_c<@http://localhost:3000/static/js/bundle.js:36877:97
div
./node_modules/react-bootstrap/esm/Container.js/_c<@http://localhost:3000/static/js/bundle.js:32709:103
NewPostPage@http://localhost:3000/static/js/bundle.js:85699:56
RenderedRoute@http://localhost:3000/static/js/bundle.js:66553:7
Routes@http://localhost:3000/static/js/bundle.js:67258:7
div
div
./node_modules/react-bootstrap/esm/Col.js/_c<@http://localhost:3000/static/js/bundle.js:32540:14
div
./node_modules/react-bootstrap/esm/Row.js/_c<@http://localhost:3000/static/js/bundle.js:36877:97
div
./node_modules/react-bootstrap/esm/Container.js/_c<@http://localhost:3000/static/js/bundle.js:32709:103
div
App@http://localhost:3000/static/js/bundle.js:76712:88
Router@http://localhost:3000/static/js/bundle.js:67195:7
BrowserRouter@http://localhost:3000/static/js/bundle.js:65000:7
 */

export default function NewPostPage() {
  //const defaultValue = {}
  //const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
  const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext)
  const userToken = localStorage.getItem("token") ?? "";

  const { replyPostId } = useParams<{ replyPostId?: string }>();
  
  
  var Dchar = 1024;

  const [text,setText] = useState("");
  const [receivers, setReceivers] = useState<string[]>([]);
  const [nReceivers, setNReceivers] = useState(0);

  const [repeatPostInterval, setRepeatPostInterval] = useState(0)
  const [repeatPostTimeUnit, setRepeatPostTimeUnit] = useState("Minuti")

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
        fetchUserData()
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
    if (parseInt(getComputedStyle(textarea).height) > 40) return 12
    //const maxHeight = textarea.parentElement?.clientHeight;  //non funziona, il componente cardbody si allunga dinamicamente
    const maxHeight = window.innerHeight / 3
    
    const maxLines = Math.floor(maxHeight / lineHeight);
    
    const lines = calculateNumberOfTextLines(textarea);
    return Math.min(lines, maxLines);
  }
  
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    
    console.log("tipo di input: ", Type)
    console.log('inputText: ', inputText)

    if (Type === 'txt') {
      console.log('TXT')
      setCharCount(inputText.length);
      setTextLines(getTextLines(event.target));
      setText(inputText)
    } else if (Type === 'pst' || Type === 'upl' || Type === 'cmr') {
      console.log('IMMAGINI')
      if (inputText.length > 0) { // se è stato incollato un immagine
        setCharCount(125);        // imposto il numero di caratteri usati a 125
        setText(inputText)
      } else if (inputText.length === 0) { // se è stato cancellato il contenuto
        setCharCount(0);
        console.log('An empty string was passed');
      }
    } else if (Type === 'mp4') {
    } else if (Type === 'gps') {
      setCharCount(125);        // imposto il numero di caratteri usati a 125
      setText(inputText)
      console.log('GPS XD ', inputText)
    }
  };

  const handleReceiverInputChange = (text: string, receiversArrayIndex: number, receiverType: string) => {
    const inputText = receiverType + text;
    
    /* aggiorna l'array di destinatari modificando solo l'indice corrispondente al campo modificato */
    setReceivers(receivers => receivers.map((receiver, index) =>
      index === receiversArrayIndex-1 ? inputText : receiver));
    console.log("destinatario: ", inputText) //DEBUG
  }

  const onlyUsersInReceivers = () => {
    let receiversCopy = receivers
    //non considero i destinatari non settati bene (lasciati con "to" o con solo "@")
    receiversCopy = receiversCopy.filter(receiver => { 
      if (receiver) return ( receiver.length > 1 && receiver[0]+receiver[1] !== "to" ) 
      else return false
    })
    //però se sono tutti lasciati con "to" allora lo squeal è pubblico ed è come se fosse indirizzato ad un canale
    if (receiversCopy.length === 0)return false

    //se una volta tolti i "to" rimangono solo @ allora sono solo utenti i destinatari
    let returnValue = true
    receiversCopy.map(receiver => { 
      if (receiver) returnValue = returnValue && receiver[0] === "@" 
    })
    return returnValue
  }

  const handleSubmit = async (event:React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    console.log('sei qui')
    try{
      console.log("DEBUG")
      const response = await axios.post(apiPostsURL,
        {username: userDetails.username, text: text, receivers: receivers, repeatPostInterval: {interval: repeatPostInterval, unit: repeatPostTimeUnit}},
        { headers: {"Authorization": `Bearer ${userToken}`}}
        ).then((response) => {
          if (replyTo) axios.put(`${apiPostsURL}/${replyTo}/replies`,
                                            {replyPostId: response.data.postId})
        })
        .then(() => {
          //toglie caratteri utente dal database
          if (!onlyUsersInReceivers()) axios.patch(apiUsersURL+'/'+userDetails.username+'/characters',
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
        .then(()=>{
          //aggiorna dati utente in locale
          console.log("ENTRO IN GETPERSONAUSERDATA")
          fetchUserData()
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

  //non più usati perchè ora si vede tutto dalla barra laterale o superiore
  const [displayDailyChars, setDisplayDailyChars] = useState(0)
  const [displayWeeklyChars, setDisplayWeeklyChars] = useState(0)
  const [displayMonthlyChars, setDisplayMonthlyChars] = useState(0)


  const[Type, setType] = useState('txt');
  
  const handleType = (eventKey: string | null) => {
    console.log("debug handleType eventkey: ", eventKey)
    if (eventKey === null) return;
    setCharCount(0)
    setType(eventKey);
  };

  return(
    <Container>
      <Row>
        
        {onlyUsersInReceivers() ? 
        ( <p className="bg-info mt-3">Stai mandando un messaggio privato. Non consumerai caratteri</p> ) : (    //se il post è un messaggio privato non visualizzo  avvisi
          userDetails.debtChar > 0 ?    // se l'utente ha già debito di caratteri
          (
            <Alert key="danger" variant="danger">
              <Alert.Heading>ATTENZIONE: hai accumulato del debito di caratteri!</Alert.Heading>
              <p>Attualmente, devi acquistare {userDetails.debtChar} caratteri per poter nuovamente postare. <br/>
              In alternativa, puoi aspettare la prossima paghetta di caratteri</p>
              <hr />
              <Alert.Heading>Comprare caratteri necessari</Alert.Heading>
              <p>Per poter postare di nuovo, dirigiti al Negozio e sana il tuo debito</p>
              <div className="d-flex justify-content-end">
                <Button onClick={() => navigate("/charShop")} variant="success">
                  Negozio
                </Button>
              </div>
            </Alert>
          ) :   //se l'utente non è in debito ma mandando questo post finisce i caratteri
          ( userDetails.dailyChar - charCount <= 0 || userDetails.weeklyChar - charCount <= 0 || userDetails.monthlyChar - charCount <= 0 ?
            (
              <Alert key="danger" variant="danger">
                <Alert.Heading>ATTENZIONE: hai esaurito i caratteri!</Alert.Heading>
                  <p>Se decidi di pubblicare comunque il tuo squeal, andrai in debito di 
                    <strong> {charCount - Math.min(userDetails.dailyChar, userDetails.weeklyChar, userDetails.monthlyChar)} </strong> caratteri. 
                    Ciò significa che non potrai pubblicare altri squeal finchè il tuo debito non sarà risanato!
                  </p>
                  <hr />
                  <Alert.Heading>Cosa puoi fare?</Alert.Heading>
                  <Accordion className="pt-2">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>
                        Compra altri caratteri
                      </Accordion.Header>
                      <Accordion.Body>
                        <p>Puoi comprare caratteri con cui postare diregendoti al Negozio</p>
                        <div className="d-flex justify-content-end">
                        <Button onClick={() => navigate("/charShop")} variant="success">Negozio</Button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>
                        Attendere prossimo reset quota
                      </Accordion.Header>
                      <Accordion.Body>
                        <p>In alternativa, puoi aspettare che la tua quota di caratteri venga ricolmata domani / prossima settimana / mese prossimo.</p>
                        <p>Ma dovresti aspettare. In alternativa, puoi...</p>
                        <div className="d-flex justify-content-end">
                        <Button onClick={() => navigate("/charShop")} variant="success">Spendere tutti i tuoi risparmi</Button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>
                        Caratteri premio 
                      </Accordion.Header>
                      <Accordion.Body>
                        <p>Sapevi che se i tuoi post diventano popolari, ricevi caratteri da poter usare per pubblicare nuovi squeal?</p>
                        <p>Controlla lo stato dei tuoi post, o assumi un Social Media Manager per farlo al posto tuo. Chi sa, da un giorno all'altro, un tuo post potrebbe diventare virale.</p>
                        <p>Ma si sa. Chi vive sperando, muore cagando.</p>
                        <div className="d-flex justify-content-end">
                          <Button onClick={() => navigate("/charShop")} variant="success">Prendi ora in mano il tuo futuro!</Button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
              </Alert>

            ) :
            (
              <></>
            )
          )
        )}
      </Row>

      <Row className="justify-content-md-center">
        <Col xs={12} g={{ span: 6, offset: 3 }}>
          <Card bg='dark' text='white' className="mt-3">
            <Card.Header>
            <div className="tags">
              <Stack direction="horizontal" gap={2}>
                <img src={`${userDetails.userImage}`} alt="user profile picture" width={50} className="rounded-circle"/>
                <span className="p-2 displayedName">{userDetails.displayName}</span>
                <span className="p-2 tagName">{'@'+userDetails.username}</span>
                  <div className="ms-auto me-3">
                    <Badge pill bg="success">
                      <h5>{charCount}/{userDetails.dailyChar}</h5>
                    </Badge>
                  </div>
              </Stack>
            </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <Stack direction="horizontal" gap={3}>
                  <span>Destinatari: {nReceivers}</span>
                  <ButtonGroup className="ms-auto" aria-label="Basic example">
                    <Button 
                      variant="dark"
                      className="btn-transparent"
                      disabled={nReceivers>100 || (replyPostId ? true : false)}
                      onClick={handleAddReceivers}>
                    <Add/></Button>
                    <Button
                      variant="dark"
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
                <div className="mt-2">
                  <AdvancedOptions handleRepeatIntervalChange={setRepeatPostInterval} handleIntervalTimeUnitChange={setRepeatPostTimeUnit} />
                </div>
                <hr />
                <CardBody
                  type={Type}
                  onInputChange={handleInputChange}
                  charCount={charCount}
                  textLines={textLines}
                  Dchar={userDetails.dailyChar}
                  txtReadOnly={!onlyUsersInReceivers() && userDetails.debtChar > 0}
                  receiversOnlyUsers={onlyUsersInReceivers()}
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
                      <div className="d-flex flex-row">
                        <div>
                          <IconPaste/> 
                        </div>
                        <div className="vr mx-3"/>
                        <div className="ms-auto">Incolla dagli appunti</div>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      className="btn btn-secondary"
                      onClick={() => handleType('upl')}
                    >
                      <div className="d-flex flex-row">
                        <div>
                          <IconUpload/> 
                        </div>
                        <div className="vr mx-3"/>
                        <div className="ms-auto">Carica un'immagine</div>
                      </div>
                      
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      className="btn btn-secondary"
                      onClick={() =>{ handleType('cmr'); console.log("cmr click")}}
                    >
                      <div className="d-flex flex-row">
                        <div>
                          <IconCamera/> 
                        </div>
                        <div className="vr mx-3"/>
                        <div className="ms-auto">Scatta una foto</div>
                      </div>
                      
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