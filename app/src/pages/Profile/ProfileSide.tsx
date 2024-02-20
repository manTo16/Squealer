import React, { useContext } from "react";
import Options from "./Options";
import Feed from "@components/Feed/Feed";
import User from "./User";
import Utente from "./User";
import { useNavigate, useParams } from "react-router-dom"
// import ChannelsList from "./ChannelsList";
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { apiUsersURL, channelsURL } from '../../URLs';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { Col, Row } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge';
import { UserContext, UserDetailsInterface } from "@utils/userData";

interface proSideProps {
    type: string;
}

export default function ProfileSide({
    type
}: proSideProps) {
    
    const { query } = useParams<{query?: string}>()
    const isLoggedIn = !!localStorage.getItem('token')
    const defaultValue = {}
    const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext) as { userDetails: UserDetailsInterface, fetchUserData: Function, updateUserDataFromLS: Function }

    const userToken = localStorage.getItem('token');
    const username = userDetails.username
    const navigate = useNavigate()

    const [displayedChannels, setDisplayedChannels] = useState<string[]>([])

    interface Usernames {
        owners: string[];
        writers: string[];
        readers: string[];
        subs: string[];
    }
    
    interface ChannelData {
        usernames: Usernames;
        _id: string;
        channelName: string;
        description: string;
        reserved: boolean;
        postsIds: string[];
    }
    
    interface ChannelsData {
        [channelName: string]: ChannelData;
    }

    const [channelsData, setChannelsData] = useState<ChannelsData>({});



    useEffect(() => {
        if (displayedChannels) {
            displayedChannels.forEach(async channelName => {
                if (channelName) {
                    const channelData = await axios.get(`${channelsURL}/data/${channelName}`).then(response => response.data)
                    setChannelsData(prevState => ({ ...prevState, [channelName]: channelData }))
                }
            })
        }
    }, [displayedChannels])

    useEffect(() => {
        const loadChannels = async () => {
            const response = await axios.get(apiUsersURL+`/${username}/channels`, { headers: {"Authorization": `Bearer ${userToken}`}})
            console.log("loadChannels response", response)
            let channelsArray = []
            if (response && response.status === 200) channelsArray = response.data
            console.log("loadChannels channelsarray", channelsArray, "(response.status: ", response?.status, ")")
            return channelsArray
        }

        const fetchChannels = async () => {
            setDisplayedChannels(await loadChannels());
        }
        if (userToken) fetchChannels();
    }, [])

    if (type === 'profile') {
        return (
            <>
                <Utente/>
            </>
        );
    } else if (type === 'channels') {
        return (
            <div className="rounded bg-dark bt-2">
                <h1>Channels List</h1>
                { userToken ? (
                    
                    <Row xs={1} md={2} className="g-4">
                    {displayedChannels.map((channelName, index) =>
                        <Col key={index}>
                        <Card bg="dark" border="success" text="white">
                            <Card.Body>
                            <Card.Title>
                                <span >{channelName}</span> 
                                {channelsData && ( channelsData[channelName]?.usernames.owners.includes(userDetails.username) || channelsData[channelName]?.usernames.owners.length === 0) && <Badge pill className="m-1" bg="success">Proprietario</Badge>}
                                {channelsData && ( channelsData[channelName]?.usernames.writers.includes(userDetails.username) || channelsData[channelName]?.usernames.writers.length === 0) && <Badge pill className="m-1" bg="warning" text="dark">Scrittore</Badge>}
                                {channelsData && ( channelsData[channelName]?.usernames.readers.includes(userDetails.username) || channelsData[channelName]?.usernames.readers.length === 0) && <Badge pill className="m-1" bg="primary">Lettore</Badge>}  
                            </Card.Title>
                            <Card.Text>
                                {channelsData && channelsData[channelName]?.description}
                            </Card.Text>
                            </Card.Body>
                        </Card>
                        </Col>
                    )}
                    </Row>

                ) : (
                    <div>Please log in to see your channels</div>
                )}

            </div>
        );
    } else if (type === 'options') {
        return (
            <Options/>
        );
    } else {
        return null;
    }
}