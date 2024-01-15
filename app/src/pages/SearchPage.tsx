import Feed, { SearchResultType } from "@components/Feed/Feed"
import axios from "@root/axiosConfig"
import { useEffect, useState } from "react"
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import { apiUsersURL, channelsURL } from "../URLs"
import { useNavigate, useParams } from "react-router-dom"





export default function SearchPage() {

    const { query } = useParams<{query?: string}>()

    const [selectedButton, setSelectedButton] = useState(1)

    const [displayedChannels, setDisplayedChannels] = useState([])
    const [displayedUsernames, setDisplayedUsernames] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const loadChannels = async () => {
            const channelsArray = await axios.get(`${channelsURL}/search/byChannelName/${query}`)
            .then(response => response.data)
            setDisplayedChannels(channelsArray)
        }
        loadChannels()

        const loadUsernames = async () => {
            const usernamesArray = await axios.get(`${apiUsersURL}/search/byDisplayName/${query}`)
            .then(response => response.data)
            setDisplayedUsernames(usernamesArray)
        }
        loadUsernames()
    
        // fetch channels data only if logged in
      }, [])
    

    return (
        <>
        <div className="pt-md flex flex-wrap items-center justify-between">
            Cerca tra:
            <ToggleButtonGroup value={selectedButton} type="radio" name="searchIn">
                <ToggleButton name="searchIn" id="selectPost" value={1} onClick={() => setSelectedButton(1)}>
                    Post
                </ToggleButton>
                <ToggleButton name="searchIn" id="selectChannels" value={2} onClick={() => setSelectedButton(2)}>
                    Canali
                </ToggleButton>
                <ToggleButton name="searchIn" id="selectUsers" value={3} onClick={() => setSelectedButton(3)}>
                    Utenti
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
        {selectedButton === 1 &&

            <Feed searchQuery={query} searchResult={SearchResultType.Posts} />
        }

        {selectedButton === 2 &&
        displayedChannels.map((channelName, index) =>
          <Button key={index} 
          className="mb-2"
          onClick={() => {navigate(`/channels/${channelName}`)}}
          variant="outline-light">
            {channelName}
          </Button>  )
        }

        {selectedButton === 3 &&
        displayedUsernames.map((username, index) => 
        <p key={index}>{username}</p>)}
        </>
    )
}