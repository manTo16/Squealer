import "./post.scss"
import VDots from "../svg/VDotsSvg"
import propic from "../../assets/person/9.png"
import Like from "../svg/Reaction/LikeSvg"
import Heart from "../svg/Reaction/HeartSvg"

import axios from "axios"
import { apiPostsURL } from "../../URLs"

import { MutableRefObject, useEffect, useRef, useState } from "react"
import { Stack } from "react-bootstrap"



export default function Post({postId = "defaultId"}: {postId?: string}) {
    async function loadPostData(postId: string) {
 
        const postData = await axios.get(apiPostsURL + `/${postId}`).then((response) => (response.data));
        setPostData({
            postText: postData.text,
            postDisplayedName: postData.displayName,
            postUsername: postData.username,
            postReceivers: postData.receivers,
            postLikeCounter: postData.impressions.likes,
            postDislikes: postData.impressions.dislikes,
            postViews: postData.impressions.views
        })
    }

    const [postData, setPostData] = useState({
        postText: "",
        postDisplayedName: "",
        postUsername: "",
        postReceivers: [],
        postLikeCounter: 0,
        postDislikes: 0,
        postViews: 0
    });

    let postTextLength = 0;

    useEffect(() => {
        loadPostData(postId);
        handleImpressions('view')
    }, [])

    postTextLength = postData.postText.length;

    const handleImpressions = (impression:string) => {
      try{
        const response = axios.patch(apiPostsURL+`/${postId}/impressions/${impression}`)
        setPostData((prev)=>{
          switch(impression){
            case 'like':
              return{
                ...prev,
                postLikeCounter: prev.postLikeCounter+1
              }
            case 'dislike':
              return{
                ...prev,
                postLikeCounter: prev.postDislikes+1
              }
            case 'view':
              return{
                ...prev,
                postLikeCounter: prev.postViews+1
              }
            default:
              return {
                ...prev
              }
          }

        })
      }
      catch(e){
        console.log(e)
      }
    }

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <Stack direction="horizontal">
                        <img 
                            width={35}
                            className="rounded-circle"
                            src={propic}
                            alt="" 
                        />
                        <span className="p-2">{postData.postDisplayedName}</span>
                        <span className="p-2 text-secondary">{postData.postUsername}</span>
                        <span className="p-2">{postData.postReceivers[0] ?? "nullo"}</span>
                    </Stack>
                    <div className="postTopRight">
                        <span className="postCharUsed">{postTextLength}</span>
                        <VDots />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{postData.postText}</span>
                    <img className="postImg" src="/assets/post/2.jpg" alt="" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <button className="btn-transparent" onClick={()=>handleImpressions('like')}>
                            <Like className="likeIcon"/>
                        </button>
                        <button className="btn-transparent">
                            <Heart className="likeIcon"/>
                        </button>
                        <span className="postLikeCounter">piace a {postData.postLikeCounter} utenti</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{postData.postViews} Views</span>
                    </div>
                </div>
            </div>
        </div>
    )
}