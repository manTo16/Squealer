import "./feed.css"
import Post from "../Post/Post"

import axios from "axios"
import { apiPostsURL, channelsURL, apiUsersURL } from "../../URLs"

import { useEffect, useState } from "react"




const fetchFeedALL = async () => {
    //const numberOfPosts = 5;
    const response = await axios.get(apiPostsURL);
    if (response.status === 200) {
        const postList = response.data.map((post: {_id: string}) => (post._id))
        console.log("fetchFeedALL returns: ", postList)
        return postList
    }
    else return []
}

const fetchFeedFromChannel = async (channelName: string) => {
    const response = await axios.get(channelsURL+"/"+channelName)
    if (response.status === 200) return response.data
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

interface FeedProps {
    channelName?: string;
    userName?: string;
    visualizedImpression?: ReactionType;
}

/*
NON DICHIARATE INSIEME channelName e userName non ha senso
*/
export default function Feed({channelName="", userName="", visualizedImpression=ReactionType.Default} : FeedProps) {
    const [postList, setPostList] = useState<string[]>([]);

    const [userImpressions, setUserImpressions] = useState({
        veryLikes: [],
        likes: [],
        dislikes: [],
        veryDislikes: [],
        views: []
    })
    const [impressionToVisualize, setImpressionToVisualize] = useState(visualizedImpression)

    const fetchFeedFromUserImpressions = async (userName: string) => {
        const response = await axios.get(apiUsersURL + "/" + userName + "/impressions")
        setUserImpressions(response.data)
        console.log("Feed fetchFeedFromUserImpressions response.data", response.data)
    }

    function switchImpressedPosts() {
        switch(visualizedImpression) {
            case ReactionType.VeryLike:
                console.log("FEED sono dentro VeryLike")

                setPostList(userImpressions.veryLikes)
                break
            case ReactionType.Like:
                setPostList(userImpressions.likes)
                break
            case ReactionType.Dislike:
                setPostList(userImpressions.dislikes)
                break
            case ReactionType.VeryDislike:
                setPostList(userImpressions.veryDislikes)
                break
            case ReactionType.View:
                setPostList(userImpressions.views)
                break 
            default:    //non dovrebbe succedere se non al limite nel caricamento
                console.log("Feed switchImpressedPosts default???")
                setPostList([])
                break
        }
    }

    useEffect(() => {
        const fetchPosts = async () => {
            console.log("Feed fetchPosts")
            let postIdsList = []

            if(userName) {
                console.log("Feed dentro useEffect if(userName) userName: ", userName)
                fetchFeedFromUserImpressions(userName)
            }

            switch(channelName) {
                case "":
                    //postIdsList rimane []
                    break
                case "ALL":
                    console.log("FEED sono dentro ALL")

                    postIdsList = await fetchFeedALL()
                    break
                default:
                    postIdsList = await fetchFeedFromChannel(channelName)
            }
            
            setPostList(postIdsList)
        }
        fetchPosts();
        //console.log("postList: ", postList)
    }, [])

    //catena di useEffect per gestire il feed utente
    useEffect(() => {
        if (userName) fetchFeedFromUserImpressions(userName)
        console.log("Feed useEffect impressionToVisualize")
    }, [impressionToVisualize, visualizedImpression])

    useEffect(() => {
        switchImpressedPosts()
        console.log("Feed useEffect userImpressions")
    }, [userImpressions])
    
    //useeffect di DEBUG
    useEffect(() => {
        console.log("Feed postList: ", postList)
    }, [postList])
    
    return (
        <>
           {
            postList.map((postId: string, index: number) => (
                <Post key={index} postId={postId} />
            ))
           }
        </>
    )
}


