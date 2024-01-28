import React, {useContext, useEffect, useState} from 'react'
import axios from '@root/axiosConfig'
import { channelsURL, apiUsersURL } from '../URLs'
import Form from 'react-bootstrap/Form'
import Feed, { ReactionType } from "@components/Feed/Feed"

import PostPlaceholder from '@components/Post/PostPlaceholder'
import { UserContext } from '@utils/userData'

export default function TrendingPage() {
    const [channelName,setChannelName] = useState("")
    //const isLoggedIn = !!localStorage.getItem('token')
    //const defaultValue = {}
    //const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
    const { userDetails, fetchUserData, updateUserDataFromLS } = useContext(UserContext)
    //console.log(localStorage.getItem('user'))

    const [reservedChannelName, setReservedChannelName] = useState("")

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

    const createReservedChannel = () => {
        try{
            const response = axios.post(channelsURL,{channelName: reservedChannelName,username:userDetails.username,reserved: true},{ headers: {"Authorization": `Bearer ${userToken}`}}).then(()=>{
                alert('new channel created')
                setChannelName('')
            })
        }catch(err){
            console.log(err)
        }
    }

    const cosa = async () => {  //chi sa cos'era
        const response = await axios.post(channelsURL+`/ggg`, {username: "writer", requestedRole: "writer"})

        console.log(response)
    }


    

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

            <h2>prove caratteri</h2>
            <button
            onClick={() => {axios.put(apiUsersURL+"/zedong/characters", {daily: -1, weekly: 105, monthly: -1})}}>manda richiesta put</button>

            <button
            onClick={() => {axios.patch(apiUsersURL+"/zedong/characters", {daily: -1, weekly: +1, monthly: 1})}}>manda patch</button>
            

            <h2>creazione canali riservati</h2>
            <h3>occhio che questo crea §CANALI. non ci sarà questa funzionalità nella app, ma nella mod dashboard sì</h3>
            <Form.Group className='mb-3'>
                <Form.Control onChange={(e)=>setReservedChannelName(e.target.value)} value={reservedChannelName} placeholder="type here RESERVED channel name" aria-label="channel name"/>
            </Form.Group>
            <button onClick={createReservedChannel}>create channel</button>
        </div>

    )
}