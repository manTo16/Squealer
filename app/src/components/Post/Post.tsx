import "./post.scss"
import VDots from "../svg/VDotsSvg"
import propic from "../../assets/person/9.png"
import Like from "../svg/Reaction/LikeSvg"
import Heart from "../svg/Reaction/HeartSvg"

export default function Post() {
    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <img 
                            className="postProfileImg"
                            src={propic}
                            alt="" 
                        />
                        <span className="postDisplayedName">Tova</span>
                        <span className="postUsername">@Phepega69</span>
                    </div>
                    <div className="postTopRight">
                        <span className="postCharUsed">42</span>
                        <VDots />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">Ei fu. Siccome immobile, Dato il mortal sospiro, Stette la spoglia immemore Orba di tanto spiro, Così percossa, attonita La terra al nunzio sta, Muta pensando all’ultima Ora dell’uom fatale; Nè sa quando una simile Orma di piè mortale La sua cruenta polvere A calpestar verrà.</span>
                    <img className="postImg" src="/assets/post/2.jpg" alt="" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <button className="btn-transparent">
                            <Like className="likeIcon"/>
                        </button>
                        <button className="btn-transparent">
                            <Heart className="likeIcon"/>
                        </button>
                        <span className="postLikeCounter">piace a 69 utenti</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">9 commenti</span>
                    </div>
                </div>
            </div>
        </div>
    )
}