import "./post.scss"
import VDots from "../svg/VDotsSvg"
import propic from "../../assets/person/9.png"
import Like from "../svg/Reaction/LikeSvg"
import Heart from "../svg/Reaction/HeartSvg"

import { MutableRefObject, useRef } from "react"

function loadPostData(
    postText: MutableRefObject<string>,
    postDisplayedName: MutableRefObject<string>,
    postUsername: MutableRefObject<string>,
    postLikeCounter: MutableRefObject<number>,
    postCommentsCounter: MutableRefObject<number>
    ) {
    /* 
    qua probabilmente metteremo delle chiamate al database per popolare gli elementi del post
    idealmente l'unico argomento di loadPostData è un id che identifica il post,
        perchè mettere tanti argomenti mi sembra bruttino, ma va poi bene uguale.
        per ora dobbiamo tenerci tanti argomenti perchè non so come gestire lo scope della funzione altrimenti
    mancano delle cose, tipo l'immagine
    */

   //elemento.current = api get post_id o qualcosa del genere
    postText.current = "Ei fu. Siccome immobile, Dato il mortal sospiro, Stette la spoglia immemore Orba di tanto spiro, Così percossa, attonita La terra al nunzio sta, Muta pensando all’ultima Ora dell’uom fatale; Nè sa quando una simile Orma di piè mortale La sua cruenta polvere A calpestar verrà."
    postDisplayedName.current = "Tova";
    postUsername.current = "@Phepega69";
    postLikeCounter.current = 69;
    postCommentsCounter.current = 9;
}

export default function Post() {
    const postText = useRef("");
    const postDisplayedName = useRef("");
    const postUsername = useRef("");
    const postLikeCounter = useRef(0);
    const postCommentsCounter = useRef(0);

    let postTextLength = 0;

    loadPostData(postText, postDisplayedName, postUsername, postLikeCounter, postCommentsCounter);

    postTextLength = postText.current.length;

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
                        <span className="postDisplayedName">{postDisplayedName.current}</span>
                        <span className="postUsername">{postUsername.current}</span>
                    </div>
                    <div className="postTopRight">
                        <span className="postCharUsed">{postTextLength}</span>
                        <VDots />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{postText.current}</span>
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
                        <span className="postLikeCounter">piace a {postLikeCounter.current} utenti</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{postCommentsCounter.current} commenti</span>
                    </div>
                </div>
            </div>
        </div>
    )
}