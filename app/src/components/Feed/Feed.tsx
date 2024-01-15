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
        console.log("Feed postId ", postId, " replies: ", response?.data)
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


interface FeedProps {
    channelName?: string;

    postRepliesId?: string;
    handleNumberOfReplies?: (numberOfReplies: number) => void;

    userName?: string;
    visualizedImpression?: ReactionType;
}

/*
NON DICHIARATE INSIEME tutti i props non ha senso
vanno usati così:
    channelName                                oppure
    postRepliesId e handleNumberOfReplies      oppure
    userName e visualizedImpression
*/
export default function Feed({channelName="", postRepliesId="", handleNumberOfReplies=()=>{}, userName="", visualizedImpression=ReactionType.Default} : FeedProps) {
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
    }, [visualizedImpression, channelName])
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


