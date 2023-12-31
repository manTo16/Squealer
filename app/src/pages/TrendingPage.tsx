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

    return(
        <div>
            <h1>questi bottoni li abbiamo usati solo per testare delle api, li toglieremo presto</h1>
            <h2>non create canali con spazi in mezzo che se no dobbiamo toglierli dal database, ancora non ci sono controlli</h2>
            <p> Choose displayed name </p>
            <Form.Group className='mb-3'>
                <Form.Control onChange={(e)=>setChannelName(e.target.value)} value={channelName} placeholder="type here the channel name" aria-label="channel name"/>
            </Form.Group>
            <button onClick={createChannel}>create channel</button>
            <button onClick={cosa}>addusertochannel</button>
        </div>
    )
}