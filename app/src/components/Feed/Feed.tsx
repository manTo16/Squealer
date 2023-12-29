import "./feed.css"
import Post from "../Post/Post"

import axios from "axios"
import { apiPostsURL } from "../../URLs"

import { useEffect, useState } from "react"


const fetchFeed = async () => {
    //const numberOfPosts = 5;
    const response = await axios.get(apiPostsURL);
    const postList = response.data.map((post: {_id: string}) => (post._id));
    console.log("fetchFeed returns: ", postList)
    return postList;
}



export default function Feed() {

    const [postList, setPostList] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            setPostList(await fetchFeed());
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


