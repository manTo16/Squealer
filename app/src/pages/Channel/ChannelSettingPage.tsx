import axios from "@root/axiosConfig";
import { AxiosError } from "axios";
import { channelsURL } from "@root/src/URLs";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Accordion, Button, Card, Form, ListGroup, Modal } from "react-bootstrap";

import UserSelector from "@components/UserSelector";
import { UserContext } from "@utils/userData";

import Edit from "@components/svg/EditSvg";
import IconSave from "@components/svg/SaveSvg";
import IconUsergroupAdd from "@components/svg/UsergroupAddSvg";
import IconUserPen from "@components/svg/UserPenSvg";


export default function ChannelSettingsPage() {
    const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext)

    const { channelName } = useParams<{ channelName: string }>()

    const navigate = useNavigate()

    type ChannelData = {
        channelName: string;
        description: string;
        reserved: boolean;
        usernames: {
          owners: string[];
          writers: string[];
          readers: string[];
          subs: string[];
        };
      };
      const [channelData, setChannelData] = useState<ChannelData>({
        channelName: "",
        description: "",
        reserved: false,
        usernames: {
            owners: [],
            writers: [],
            readers: [],
            subs: []
        }
    })

    const [isModifyingDescription, setIsModifyingDescription] = useState(false)
    const [isModifyingOwners, setIsModifyingOwners] = useState(false)
    const [isModifyingWriters, setIsModifyingWriters] = useState(false)
    const [isModifyingReaders, setIsModifyingReaders] = useState(false)

    const [everybodyCanWrite, setEverybodyCanWrite] = useState(false)
    const [everybodyCanRead, setEverybodyCanRead] = useState(false)

    const [showCancelModal, setShowCancelModal] = useState(false)

    const setOwners = (owners: string[]) => {
        setChannelData(prevState => ({
            ...prevState,
            usernames: {
                ...prevState.usernames,
                owners: owners
            }
        }))
    }

    const setWriters = (writers: string[]) => {
        setChannelData(prevState => ({
            ...prevState,
            usernames: {
                ...prevState.usernames,
                writers: writers
            }
        }))
    }

    const setReaders = (readers: string[]) => {
        setChannelData(prevState => ({
            ...prevState,
            usernames: {
                ...prevState.usernames,
                readers: readers
            }
        }))
    }

    
    const convertDataForSubmit = (usernames: {owners: string[], writers: string[], readers: string[]}) => {
        /* controlli proprietari */
        //almeno un proprietario per canale
        if (usernames.owners.length === 0) usernames.owners.push(userDetails.username)

        /* controlli scrittori */
        //canale pubblico
        if (everybodyCanWrite) usernames.writers = []
        //canale privato    
        else if (!usernames.writers.includes(userDetails.username)) usernames.writers.push(userDetails.username)
        
        /* controlli lettori */
        //canale pubblico
        if (everybodyCanRead) usernames.readers = [] 
        //canale privato   
        else if (!usernames.readers.includes(userDetails.username)) usernames.readers.push(userDetails.username)

        console.log("ChannelSettingPage convertDataForSubmit usernames: ", usernames)

        return usernames
    }

    const handleSubmit = () => {
        const convertedUsernamesData = convertDataForSubmit(channelData.usernames)

        axios.patch(channelsURL+"/data/"+channelName,
            {
                description: channelData.description,
                usernames: {
                    owners: convertedUsernamesData.owners,
                    writers: convertedUsernamesData.writers,
                    readers: convertedUsernamesData.readers
                }
            }
        )
        navigate(`/channels/${channelName}`)
    }


    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                const response = await axios.get(channelsURL+"/data/"+channelName).then(response => response.data)
                setEverybodyCanWrite(response.usernames.writers.length === 0)
                setEverybodyCanRead(response.usernames.readers.length === 0)
                setChannelData(response)
            } catch (error) {
                if (error instanceof Error && 'response' in error) {
                    const axiosError = error as AxiosError;
                    if (axiosError.response && axiosError.response.status === 404) {
                      console.log("ChannelSettingPage 404 con channelName: ", channelName);
                    } else {
                      throw error;
                    }
                }
            }
        }
        fetchChannelData()
    }, [])

    useEffect(() => {
        setEverybodyCanWrite(channelData.usernames.writers.length === 0)
        setEverybodyCanRead(channelData.usernames.readers.length === 0)
    }, [channelData.usernames.writers, channelData.usernames.readers])

    
    if (!userDetails.ownedChannels.includes(channelName))
    return (
    <>
    <p>oops! sembra tu non abbia i permessi</p>
    </>
    )

    return (
        <div className="h-100 overflow-auto">
            <h1 className="mb-3">§{channelData.channelName}</h1>
             <Card className="mb-4 bg-dark">  {/* description */}
                <Card.Header>
                    <Card.Title>
                        <div className="d-flex align-items-center">
                        Descrizione del Canale 
                            <div className="ms-auto">
                                { isModifyingDescription ?
                                    (
                                        <Button
                                        onClick={() => setIsModifyingDescription(false)}
                                        className='bg-transparent btn-outline-dark text-white'
                                        ><IconSave/></Button>
                                    ) : (
                                        <span><Button
                                        onClick={() => setIsModifyingDescription(true)}
                                        className='bg-transparent btn-outline-dark text-white'
                                        ><Edit/></Button></span>
                                    )
                                }
                            </div>
                        </div> 
                    </Card.Title>
                </Card.Header>

                <Card.Body>
                    
                    
                    {isModifyingDescription ? 
                    (
                        <Form.Control autoFocus onChange={(e) => setChannelData({...channelData, description: e.target.value})} value={channelData.description} />
                    ) :
                    (
                        <Card.Text>
                            {channelData.description ? channelData.description : <p className="text-secondary">Sembra che il tuo canale non abbia una descrizione. Aggiungila pure!</p>}
                        </Card.Text>
                    )
                    }
                    
                </Card.Body>
            </Card>


            <Accordion alwaysOpen>
            <Accordion.Item eventKey="0">
                <Card>
                <Card.Header>
                    <Accordion.Button style={{backgroundColor:"#272b30"}}>
                    Gestione proprietari
                    </Accordion.Button>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        {isModifyingOwners ?
                        (<>
                            <UserSelector buttons={channelData.usernames.owners} setButtons={setOwners} placeholderText="Aggiungi proprietari"/>
                            <div className="d-flex justify-content-end"><Button variant="outline-light" onClick={() => setIsModifyingOwners(false)}>Salva</Button></div>
                        </>) :
                        (<div className="d-flex align-items-center">
                            <span className="fw-bold">{channelData.usernames.owners.join(', ')}</span>
                            <Button 
                                onClick={() => setIsModifyingOwners(true)}
                                className="ms-auto bg-transparent btn-outline-dark text-white"
                            >
                                <IconUsergroupAdd/>
                            </Button>
                        </div>)
                        }
                    </Card.Body>
                </Accordion.Collapse>
                </Card>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
                <Card>
                <Card.Header>
                    <Accordion.Button style={{backgroundColor:"#272b30"}}>
                    Impostazioni scrittura
                    </Accordion.Button>
                </Card.Header>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                        <div className="d-flex align-items-center">
                            <Form.Check
                            type="checkbox"
                            label="Chiunque può postare"
                            disabled={!isModifyingWriters}
                            checked={everybodyCanWrite}
                            onChange={(e) => setEverybodyCanWrite(e.target.checked)}/>
                            {isModifyingWriters ? 
                            (
                                <Button className="ms-auto" variant="dark" onClick={() => setIsModifyingWriters(false)}><IconSave /></Button>
                            ) : 
                            (
                                <Button className="ms-auto" variant="dark" onClick={() => setIsModifyingWriters(true)}><IconUserPen /></Button>
                            )
                            }
                        </div>
                        {isModifyingWriters ?
                            (<>
                                {!everybodyCanWrite && <UserSelector buttons={channelData.usernames.writers} setButtons={setWriters} placeholderText="Chi può postare?"/> }
                            </>) 
                            :
                            (<>
                                {!everybodyCanWrite && 
                                <>
                                <p>Chi può postare:</p>
                                {everybodyCanWrite ? ("Tutti") : ( (channelData.usernames.writers.length === 0) ? ("Nessuno") : channelData.usernames.writers.join(', ') ) }
                                </>
                                }
                            </>)
                        }
                        
                    </Card.Body>
                </Accordion.Collapse>
                </Card>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
                <Card>
                <Card.Header>
                    <Accordion.Button style={{backgroundColor:"#272b30"}}>
                    Impostazioni lettura
                    </Accordion.Button>
                </Card.Header>
                <Accordion.Collapse eventKey="2">
                    <Card.Body>
                        <div className="d-flex align-items-center">
                            <Form.Check 
                            type="checkbox"
                            label="Chiunque può leggere"
                            disabled={!isModifyingReaders}
                            checked={everybodyCanRead}
                            onChange={(e) => setEverybodyCanRead(e.target.checked)}/>
                            {isModifyingReaders ?
                                (
                                    <Button className="ms-auto" variant="dark" onClick={() => setIsModifyingReaders(false)}><IconSave /></Button>
                                ) :
                                (
                                    <Button className="ms-auto" variant="dark" onClick={() => setIsModifyingReaders(true)}><IconUserPen /></Button>
                                )
                            }
                        </div>

                        {isModifyingReaders ?
                            (<>
                            {!everybodyCanRead && <UserSelector buttons={channelData.usernames.readers} setButtons={setReaders} placeholderText="Chi può vedere i post?"/> }
                            
                            
                            </>) :
                            (<>
                                {!everybodyCanRead && 
                                <>
                                <p>Chi può leggere il contenuto del canale:</p>
                                {everybodyCanRead ? ("Tutti") : ( (channelData.usernames.readers.length === 0) ? ("Nessuno") : channelData.usernames.readers.join(', ') ) }
                                </>
                                }
                                
                            </>)
                        }   
                    </Card.Body>
                </Accordion.Collapse>
                </Card>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
                <Card>
                <Card.Header>
                    <Accordion.Button style={{backgroundColor:"#272b30"}}>
                    {channelData.usernames.subs.length} {channelData.usernames.subs.length === 1 ? "Iscritto" : "Iscritti"} al canale
                    </Accordion.Button>
                </Card.Header>
                <Accordion.Collapse eventKey="3">
                    <Card.Body>{channelData.usernames.subs.join(', ')}</Card.Body>
                </Accordion.Collapse>
                </Card>
            </Accordion.Item>
            </Accordion>


            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} animation={false} centered>
                <Modal.Header closeButton>
                <Modal.Title>Sei sicuro di voler uscire?</Modal.Title>
                
                </Modal.Header>
                <Modal.Body>
                Le tue modifiche andranno perse
                    <div className="d-flex justify-content-end mt-4">
                    <Button variant="dark" className="mx-1" onClick={() => setShowCancelModal(false)}>
                    Annulla
                </Button>
                <Button variant="light" className="mx-1" onClick={() => navigate(`/channels/${channelName}`)}>
                    Esci
                </Button>
                </div>
                </Modal.Body>
            </Modal>
            
            <div className="mt-5 mb-3 d-flex justify-content-end">
            <Button variant="dark" className="mx-1" onClick={() => setShowCancelModal(true)}>Annulla modifiche</Button>
            <Button variant="light" className="mx-1" onClick={() => handleSubmit()}>Salva</Button>
            </div>

        </div>
    )
}