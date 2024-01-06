import React, {useEffect, useState} from 'react'
import axios from '@root/axiosConfig'
import { channelsURL, apiUsersURL } from '../URLs'
import Form from 'react-bootstrap/Form'
import Feed, { ReactionType } from "@components/Feed/Feed"

export default function TrendingPage() {
    const [channelName,setChannelName] = useState("")
    //const isLoggedIn = !!localStorage.getItem('token')
    const defaultValue = {}
    const userDetails = JSON.parse(localStorage.getItem('user') ?? 'null') ?? defaultValue
    //console.log(localStorage.getItem('user'))
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



    const [reactionType, setReactionType] = useState(ReactionType.Default)

    const [usernameReaction, setUsernameReaction] = useState("")
    

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
            <p>qui si vedono i post a cui l'utente loggato ha reagito. probabilmente più avanti farò in modo di vedere anche i post che un utente ha creato</p>

            <p>
                questo è come si può usare il feed per vedere queste cose (vedi codice) 
                praticamente basta passare ai props del Feed l'username dell'utente di cui si vogliono vedere i post e il tipo di reazione
            </p>
            <p>il problema è che visto che il Feed è un componente, deve rifare le richieste tutte le volte</p>
            <p>
                quindi direi che prima o poi inizierò a salvare nel localStorage o sessionStorage o comunque in locale i post presi dall'api che prende i post a cui un utente ha reagito, così schiacciando i bottoni non rifa le richieste al server ma le prende dal locale
            </p>
            
            <p>se lasci la barra vuota fa vedere i tuoi, se metti un utente che non trova il backend ritorna 404 e il frontend dà errore </p>

            <Form.Group className='mb-3'>
                <Form.Control onChange={(e)=>setUsernameReaction(e.target.value)} value={usernameReaction} placeholder="uente di cui vuoi vedere le reazioni"/>
            </Form.Group>
            <button
            onClick={() => setReactionType(ReactionType.VeryLike)}>
                likeone
            </button>
            <button
            onClick={() => setReactionType(ReactionType.Like)}>
                like normale
            </button>
            <button
            onClick={() => setReactionType(ReactionType.Dislike)}>
                dislike
            </button>
            <button
            onClick={() => setReactionType(ReactionType.VeryDislike)}>
                dislikeone
            </button>
            <button
            onClick={() => setReactionType(ReactionType.View)}>
                view
            </button>




            <Feed 
           userName={usernameReaction ? usernameReaction : userDetails.username}
           visualizedImpression={reactionType}
           />
           <p>{reactionType}</p>
        </div>
    )
}