import axios from "@root/axiosConfig";
import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { apiUsersURL, channelsURL } from "../URLs";
import { useNavigate } from "react-router-dom";

interface SearchBarPopupProps {
    show: boolean;
    handleShow: (input: boolean) => void;
}

export default function SearchBarPopup({show, handleShow} : SearchBarPopupProps) {
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState("")

    const [results, setResults] = useState<string[]>([])

    const [userResults, setUserResults] = useState<string[]>([])
    const [channelResults, setChannelResults] = useState<string[]>([])

    const getUserResultsByUsername = async (query: string) => {
        if (query) {
            const result = await axios.get(apiUsersURL+`/search/byUsername/oneResult/${query}`)
                            .then(response => response.data)
            return result
        }
        else return []
        
    }

    const getUserResultsByDisplayName = async (query: string) => {
        if (query) {
            const result = await axios.get(apiUsersURL+`/search/byDisplayName/oneResult/${query}`)
                            .then(response => response.data)
            return result
        }
        else return []
        
    }

    function concatNoDuplicates(array1: string[], array2: string[]): string[] {
        const set = new Set(array1.concat(array2));
        return Array.from(set);
    }

    const getChannelResults = async (query: string) => {
        if (query) {
            const result = await axios.get(channelsURL+`/search/byChannelName/oneResult/${query}`)
                                .then(response => response.data)
            return result
        }
        else {
            return []
        }
    }



    useEffect(() => {
        setResults([])

        const updateUserResults = async () => {
            let userResults = []
            const partialUserResults1 = await getUserResultsByUsername(searchQuery)
            const partialUserResults2 = await getUserResultsByDisplayName(searchQuery)

            userResults = concatNoDuplicates(partialUserResults1, partialUserResults2)

            setUserResults(userResults)
        }
        updateUserResults()

        const updateChannelResults = async () => {
            setChannelResults(await getChannelResults(searchQuery))
        }
        updateChannelResults()

    }, [searchQuery])

    useEffect(() => {
        setResults([])

        let updatedResults: string[] = []

        //aggiungo ricerca per username
        userResults.map((result) => updatedResults.push(result))

        //aggiungo ricerca per canali
        channelResults.map((result) => updatedResults.push(result))

        //i post si potrebbe fare che se uno li vuole vedere se li cerca usando il tasto più risultati

        setResults(updatedResults)
    }, [userResults, channelResults])

    return(
    <>
    <Modal show={show} onHide={() => handleShow(false)}>
    <Modal.Header closeButton>
        <Form.Control type="text" placeholder="Cerca" onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
    </Modal.Header>
    <Modal.Body>
        <div> 
        {
            results.map((result, index) => {
                return <p className="text-dark" key={index}>{result}</p>
            })
        } 
        </div>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => {
                                                    handleShow(false)
                                                    navigate(`/search/${searchQuery}`)}}>
            Più risultati
        </Button>
    </Modal.Footer>
    </Modal>
    </>
    )
}