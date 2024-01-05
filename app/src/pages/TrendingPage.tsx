import React, {useState} from 'react'
import axios from 'axios'
import { channelsURL } from '../URLs'
import Form from 'react-bootstrap/Form'

export default function TrendingPage() {
    const [channelName,setChannelName] = useState("")
    //const isLoggedIn = !!localStorage.getItem('token')
    const defaultValue = {}
    const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
    console.log(localStorage.getItem('user'))
    const userToken = localStorage.getItem('token')
    const createChannel = () => {
        try{
            const response = axios.post(channelsURL,{channelName,username:userDetails.username,reserved: false},{ headers: {"Authorization": `Bearer ${userToken}`}}).then(()=>{
                alert('new channel created')
                setChannelName('')
            })
        }catch(err){
            console.log(err)
        }
    }

    const cosa = async () => {
        const response = await axios.post(channelsURL+`/ggg`, {username: "writer", requestedRole: "writer"})

        console.log(response)
    }

    const [postVisualizzati, setPostVisualizzati] = useState(0)

    return(
        <div>
            <h1>questi bottoni li abbiamo usati solo per testare delle api, li toglieremo presto</h1>
            <h2>i canali in teoria hanno i controlli giusti nel backend ora</h2>
            <p> Choose displayed name </p>
            <Form.Group className='mb-3'>
                <Form.Control onChange={(e)=>setChannelName(e.target.value)} value={channelName} placeholder="type here the channel name" aria-label="channel name"/>
            </Form.Group>
            <button onClick={createChannel}>create channel</button>
            {/*<button onClick={cosa}>addusertochannel</button>*/}

            <h1>questo è solo un esempio di come si potrebbe vedere la cronologia di un utente</h1>
            <h2>visto che ogni utente salva in campi diversi post ai quali ha reagito in modo diverso</h2>
            <button
            onClick={() => setPostVisualizzati(1)}>
                likeone
            </button>
            <button
            onClick={() => setPostVisualizzati(2)}>
                like normale
            </button>
            <button
            onClick={() => setPostVisualizzati(3)}>
                dislike
            </button>
            <button
            onClick={() => setPostVisualizzati(4)}>
                dislikeone
            </button>
            <button
            onClick={() => setPostVisualizzati(5)}>
                view
            </button>

            <p>
                no non è vero non ho voglia di farlo ora. domani faccio l'api per richiedere gli id dei post visualizzati o a cui un utente ha reagito
                così poi aggiungo una condizione ai props di Feed.tsx in modo che preveda anche questo tipo di feed 
                
            </p>
        </div>
    )
}