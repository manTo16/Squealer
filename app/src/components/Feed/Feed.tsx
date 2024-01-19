import "./feed.css"
import Post from "../Post/Post"

import axios, { AxiosError } from "axios"
import { apiPostsURL, channelsURL, apiUsersURL } from "../../URLs"

import { useEffect, useState } from "react"




const fetchFeedALL = async () => {
    //const numberOfPosts = 5;
    const response = await axios.get(apiPostsURL);
    if (response && response.status === 200) {
        const postList = response.data.map((post: {_id: string}) => (post._id))
        console.log("fetchFeedALL returns: ", postList)
        return postList
    }
    else return []
}

const fetchFeedFromChannel = async (channelName: string) => {
    const response = await axios.get(channelsURL+"/"+channelName)
    if (response && response.status === 200) return response.data
    else return []
}

export enum ReactionType {
    VeryLike = 'veryLike',
    Like = 'like',
    Dislike = 'dislike',
    VeryDislike = 'veryDislike',
    View = 'view',
    Default = 'none'
}

const fetchFeedFromUserImpressions = async (userName: string, visualizedImpression: ReactionType) => {
    if (visualizedImpression === ReactionType.Default) return []
    const response = await axios.get(apiUsersURL + "/" + userName + "/impressions/"+visualizedImpression+"s")
    console.log("Feed fetchFeedFromUserImpressions response.data", response?.data)
    if (response && response.status === 200) return response.data
    else return []
}

const fetchFeedFromPostReplies = async (postId: string) => {
    try {
        const response = await axios.get(`${apiPostsURL}/${postId}/replies`)
        //console.log("Feed postId ", postId, " replies: ", response?.data)
        if (response && response.status === 200) return response.data
        else return []

    } catch (error) {
        if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 404) {
              console.log("Feed fetchFeedFromPostReplies 404 con postId ", postId);
            } else {
              throw error;
            }
          }
          return []
    }
}

const fetchFeedFromSearchQuery = async (query: string, searchRoute: string) => {
    if (!searchRoute) return []
    
    let postIds = []
    if (searchRoute[0] !== "/") searchRoute = "/"+searchRoute
    if (searchRoute[searchRoute.length - 1] !== "/") searchRoute = searchRoute + "/"
    try {
        postIds = await axios.get(`${apiPostsURL}${searchRoute}${query}`)
        .then(response => response.data)
        return postIds
    } catch (error) {
        console.log(`Feed fetchFeedFromSearchQuery error in request: ${apiPostsURL}${searchRoute}${query}: `, error)
    }
    return []
}


interface FeedProps {
    channelName?: string;

    postRepliesId?: string;
    handleNumberOfReplies?: (numberOfReplies: number) => void;

    userName?: string;
    visualizedImpression?: ReactionType;

    searchQuery?: string;
    searchRoute?: string;
}

/*
NON DICHIARATE INSIEME tutti i props non ha senso
vanno usati così:
    channelName                                oppure
    postRepliesId e handleNumberOfReplies      oppure
    userName e visualizedImpression            oppure
    searchQuery e searchRoute

    in searchRoute NON mettete la parte iniziale delle api dei post: /posts lo mette in automatico
*/
export default function Feed({channelName="", 
                    postRepliesId="", handleNumberOfReplies=()=>{}, 
                    userName="", visualizedImpression=ReactionType.Default,
                    searchQuery="", searchRoute=""
                } : FeedProps) {
    const [postList, setPostList] = useState<string[]>([]);

    useEffect(() => {
        setPostList([])  //questo serve per il feed utente, senza, se cambio visualizedImpression da fuori con uno stato, i post renderizzati qua non vengono cancellati
        const fetchPosts = async () => {
            //console.log("Feed fetchPosts")
            let postIdsList = []

            if (userName) {
                //console.log("Feed dentro useEffect if(userName) userName: ", userName)
                postIdsList = await fetchFeedFromUserImpressions(userName, visualizedImpression)
            }

            else if (postRepliesId) {
                //console.log("Feed dentro useEffect if(postRepliesId) postRepliesId: ", postRepliesId)
                postIdsList = await fetchFeedFromPostReplies(postRepliesId)
            }

            else if (searchQuery) {
                postIdsList = await fetchFeedFromSearchQuery(searchQuery, searchRoute)
            }

            switch(channelName) {
                case "":
                    //postIdsList rimane []
                    break
                case "ALL":
                    postIdsList = await fetchFeedALL()
                    break
                default:
                    postIdsList = await fetchFeedFromChannel(channelName)
            }
            //console.log("Feed useEffect postIdsList: ", postIdsList)
            setPostList(postIdsList)
        }
        fetchPosts();
        //console.log("postList: ", postList)
    }, [visualizedImpression, channelName, searchQuery])
    //ho aggiunto channelName qua perchè così quando passi da una pagina /channels/canale1 a /channels/canale2 carica effettivamente il feed. altrimenti rimane bloccato al primo (usando useNavigate)

    //useeffect di DEBUG
    useEffect(() => {
        //console.log("Feed postList: ", postList)
        handleNumberOfReplies(postList.length)
        //console.log("Feed postList.length: ", postList.length, " ", channelName, postRepliesId, userName)
    }, [postList])
    
    return (
        <>
           {
            postList && postList.map((postId: string, index: number) => {
                //console.log("Feed postList.map postId: ", postId);
                return <Post key={index} postId={postId} />;
            })
           }
        </>
    )
}


