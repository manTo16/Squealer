import React from "react";
import Options from "./Options";
import Feed from "@components/Feed/Feed";
import User from "./User";
import Utente from "./User";
import { useNavigate, useParams } from "react-router-dom"
// import ChannelsList from "./ChannelsList";
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import { useState, useEffect } from 'react'
import { apiUsersURL } from '../../URLs';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { Col, Row } from "react-bootstrap";


interface proSideProps {
    type: string;
}

export default function ProfileSide({
    type
}: proSideProps) {
    
    const { query } = useParams<{query?: string}>()
    const isLoggedIn = !!localStorage.getItem('token')
    const defaultValue = {}
    const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue

    const userToken = localStorage.getItem('token');
    const username = userDetails.username
    const navigate = useNavigate()

    const [displayedChannels, setDisplayedChannels] = useState<string[]>([])

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
            <>
                <h1>Channels List</h1>
                <CardGroup>
                { userToken ? (
                    <> {
                    displayedChannels.map((channelName, index) =>
                    <Card bg="dark" text="white">
                        <Card.Body>
                        <Card.Title>{channelName}</Card.Title>
                        <Card.Text>
                            This is a wider card with supporting text below as a natural lead-in
                            to additional content. This content is a little bit longer.
                        </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col lg={8}>
                                    <small className="text-secondary">Last updated 3 mins ago</small>
                                </Col>
                                <Col lg={4}>
                                    <Button
                                        onClick={() => {navigate(`/channels/${channelName}`)}}
                                        variant="outline-light"
                                    >Vai al Canale</Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                    
                    
                    // <Button 
                    //     key={index} 
                    //     className="mb-2 w-100"
                    //     onClick={() => {navigate(`/channels/${channelName}`)}}
                    //     variant="outline-light"
                    // >
                    //     {channelName}
                    // </Button>  
                    )} </>
                ) : (
                    <div>Please log in to see your channels</div>
                )}
                </CardGroup>

            </>
        );
    } else if (type === 'options') {
        return (
            <Options/>
        );
    } else {
        return null;
    }
}