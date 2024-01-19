import axios from "@root/axiosConfig";
import { useEffect, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { apiUsersURL, channelsURL } from "../../URLs";
import { useNavigate } from "react-router-dom";

import { generateAddressURL } from "@utils/URLs"

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
    console.log("array1: ", array1, " array2: ", array2)
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

      const userResultsAt = userResults.map(result => result = "@"+result)

      setUserResults(userResultsAt)
    }
    updateUserResults()

    const updateChannelResults = async () => {
      setChannelResults(await getChannelResults(searchQuery).then(results => results.map((result: string) => result = "§"+result)))
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
      <Modal.Header style={{backgroundColor: '#282828', color: 'white'}} closeButton>
        <Form.Control style={{backgroundColor: '#272729'}} className="bg-secondary text-white" type="text" placeholder="Cerca" onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
      </Modal.Header>
      <Modal.Body style={{backgroundColor: '#282828', color: 'white'}}>
        <div> 
        {
          results.map((result, index) => {
            return (
            <div>
            <Button key={index} variant="dark" onClick={() => {
                                                navigate(generateAddressURL(result))
                                                handleShow(false)}}>
              {result}
            </Button>
            </div>
            )
            
          })
        } 
        </div>
      </Modal.Body>
      <Modal.Footer style={{backgroundColor: '#282828', color: 'white'}}>
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