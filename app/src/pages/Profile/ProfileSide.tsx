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
                { userToken ? (
                    <> {
                    displayedChannels.map((channelName, index) =>
                    <Button key={index} 
                    className="mb-2 w-100"
                    onClick={() => {navigate(`/channe ls/${channelName}`)}}
                    variant="outline-light">
                    {channelName}
                    </Button>  )
                    } </>
                ) : (
                    <div>Please log in to see your channels</div>
                )}
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