import axios from "@root/axiosConfig";
import { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { channelsURL } from "../URLs";
import { useParams } from "react-router-dom";


export default function ChannelSettingsPage() {
    const { channelName } = useParams<{ channelName: string }>()
    const description = "asdna sljsa ljfdklf jdfh ajkjk fhlfasf IJIOQRPORjaP FWLEJFWP Ò òw ke d"
    const [channelData, setChannelData] = useState({
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


    useEffect(() => {
        const fetchChannelData = async () => {
            const response = await axios.get(channelsURL+"/"+channelName).then(response => response.data)
        }
    }, [])

    return (
        <>
        <p>impostazioni canale</p>
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
                    >modifica</Button>
                )

                }
                
            </span> 
        </Card.Title>
        </Card.Header>

        <Card.Body>
            
            
            {isModifyingDescription ? 
            (
                <Form.Control>
                    
                </Form.Control>
            ) :
            (
                <Card.Text>
                    {description}
                </Card.Text>
            )
            }
            
        </Card.Body>
        </Card>
        </>
    )
}