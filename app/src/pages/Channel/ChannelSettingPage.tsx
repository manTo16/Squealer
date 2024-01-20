import axios from "@root/axiosConfig";
import { AxiosError } from "axios";
import { channelsURL } from "@root/src/URLs";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Accordion, Button, Card, Form, ListGroup } from "react-bootstrap";

import UserSelector from "@components/UserSelector";
import { UserContext } from "@utils/userData";


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


    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                const response = await axios.get(channelsURL+"/data/"+channelName).then(response => response.data)
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

    
    if (!userDetails.ownedChannels.includes(channelName))
    return (
    <>
    <p>oops! sembra tu non abbia i permessi</p>
    </>
    )

    return (
        <>
        <div className="h-100 overflow-auto">
        <h1>{channelData.channelName}</h1>
        <Card className="mb-4">
        <Card.Header>
        <Card.Title>
            Descrizione del Canale 
            <span>
                {isModifyingDescription ?
                (
                    <Button
                    onClick={() => setIsModifyingDescription(false)}
                    >Salva</Button>
                ) :
                (
                    <Button
                    onClick={() => setIsModifyingDescription(true)}
                    >modifica icona penna?</Button>
                )

                }
                
            </span> 
        </Card.Title>
        </Card.Header>

        <Card.Body>
            
            
            {isModifyingDescription ? 
            (
                <Form.Control autoFocus onChange={(e) => setChannelData({...channelData, description: e.target.value})} value={channelData.description} />
            ) :
            (
                <Card.Text>
                    {channelData.description ? channelData.description : "Sembra che il tuo canale non abbia una descrizione. Aggiungila pure!"}
                </Card.Text>
            )
            }
            
        </Card.Body>
        </Card>


        <Accordion defaultActiveKey="0" alwaysOpen>
        <Accordion.Item eventKey="0">
            <Card>
            <Card.Header>
                <Accordion.Button>
                Gestisci proprietari
                </Accordion.Button>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
                <Card.Body>
                    {isModifyingOwners ?
                    (<>
                        <UserSelector buttons={channelData.usernames.owners} setButtons={setOwners} />
                        <Button onClick={() => setIsModifyingOwners(false)}>Salva</Button>
                    </>) :
                    (<>
                        {channelData.usernames.owners.join(', ')} <Button onClick={() => setIsModifyingOwners(true)}>modifica</Button>
                    </>)
                    }
                </Card.Body>
            </Accordion.Collapse>
            </Card>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
            <Card>
            <Card.Header>
                <Accordion.Button>
                Impostazioni scrittura
                </Accordion.Button>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
                <Card.Body>
                    {isModifyingWriters ?
                    (<>
                    <UserSelector buttons={channelData.usernames.writers} setButtons={setWriters} />
                    <Button onClick={() => setIsModifyingWriters(false)}>salva</Button>
                    </>) :
                    (<>
                    <Button onClick={() => setIsModifyingWriters(true)}>modifica</Button>
                    <Form.Check 
                    type="checkbox"
                    label="Chiunque può postare"/>
                    <p>Chi può postare:</p>
                    {channelData.usernames.writers.join(', ')}
                    </>)

                    }
                    
                </Card.Body>
            </Accordion.Collapse>
            </Card>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
            <Card>
            <Card.Header>
                <Accordion.Button>
                Impostazioni lettura
                </Accordion.Button>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
                <Card.Body>
                    <Form.Check 
                    type="checkbox"
                    label="Chiunque può leggere"/>
                    <p>Chi può leggere il contenuto del canale:</p>
                    {channelData.usernames.readers.join(', ')}
                </Card.Body>
            </Accordion.Collapse>
            </Card>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
            <Card>
            <Card.Header>
                <Accordion.Button>
                Iscritti (numeroiscritti)
                </Accordion.Button>
            </Card.Header>
            <Accordion.Collapse eventKey="3">
                <Card.Body>{channelData.usernames.subs.join(', ')}</Card.Body>
            </Accordion.Collapse>
            </Card>
        </Accordion.Item>
        </Accordion>

        <Button onClick={() => navigate(`/channels/${channelName}`)}>Annulla modifiche</Button>
        <Button>Salva modifiche</Button>

        </div>
        </>
    )
}