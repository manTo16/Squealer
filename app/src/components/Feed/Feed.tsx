import "./feed.css"
import Post from "../Post/Post"

import axios from "axios"
import { apiPostsURL, channelsURL } from "../../URLs"

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



export default function Feed({channelName="ALL"} : {channelName?: string}) {

    const [postList, setPostList] = useState<string[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            let postIdsList = []
            switch(channelName) {
                case ("ALL"):
                    postIdsList = await fetchFeedALL()
                    break
                default:
                    postIdsList = await fetchFeedFromChannel(channelName)
            }
            
            setPostList(postIdsList)
        }
        fetchPosts();
        console.log("postList: ", postList)
    }, [])

    //const renderPosts()
    
    return (
        <>
           {
            postList.map((postId: string) => (
                <Post key={postId} postId={postId} />
            ))
           }
        </>
    )
}


