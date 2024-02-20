import Feed from "@components/Feed/Feed"
import axios from "@root/axiosConfig"
import { useEffect, useState } from "react"
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import { apiUsersURL, channelsURL } from "../URLs"
import { useNavigate, useParams } from "react-router-dom"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import UserSvg from '@components/svg/User';




export default function SearchPage() {

    const { query } = useParams<{query?: string}>()

    const [displayedChannels, setDisplayedChannels] = useState([])
    const [displayedUsernames, setDisplayedUsernames] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const loadChannels = async () => {
            const channelsArray = await axios.get(`${channelsURL}/search/byChannelName/${query}`)
            .then(response => response.data)
            setDisplayedChannels(channelsArray)
            console.log("SearchPage useEffect loadChannels channelsArray: ", channelsArray)
        }
        loadChannels()

        const loadUsernames = async () => {
            const usernamesArray = await axios.get(`${apiUsersURL}/search/byDisplayName/${query}`)
            .then(response => response.data)
            setDisplayedUsernames(usernamesArray)
        }
        loadUsernames()
        
      }, [query])
    

    return (
        <div className="mt-3">
        <Tabs
            defaultActiveKey="post"
            id="uncontrolled-tab-example"
            className="mb-3  text-white"
        >
            <Tab eventKey="post" title="Post">
                <Feed searchQuery={query} searchRoute="search/byText/" />
            </Tab>
            <Tab eventKey="channels" title="§Canali">
                <div className="">
                {displayedChannels.map((channelName, Description, index) =>
                    <Card className="m-1">
                        <Card.Body>
                        <Card.Title>§{channelName}</Card.Title>
                            <div className="d-flex">
                                <Button className="ms-auto" variant="primary" onClick={() => {navigate(`/channels/${channelName}`)}}>Al canale</Button>
                            </div>
                        </Card.Body>
                    </Card>
                )}
                </div>
            </Tab>
            <Tab eventKey="keyword" title="#Keyword">
                <Feed searchQuery={query} searchRoute="/search/byKeyword/" />
            </Tab>
            <Tab eventKey="users" title="@Utenti">
                {displayedUsernames.map((username, index) => 
                <Card className="m-1">
                    <Card.Body>
                        <Card.Title className="d-flex">
                            {username}
                            <Button className="ms-auto" variant="primary" onClick={() => {navigate(`/users/${username}`)}}>
                                <UserSvg className="text-white" width="20" height="20" />
                            </Button>
                        </Card.Title>
                    </Card.Body>
                </Card>
                )}
            </Tab>
        </Tabs>
        </div> 
    )
}