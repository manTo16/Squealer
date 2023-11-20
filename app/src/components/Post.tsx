import "./Post.css"



function Post(props: any) {
    return(
        <div className='post-container'>

            <h3>
                {props.username}
            </h3>

            <p className="post-content-wrapper">
                dgjfdgfhdgfhdg messaggio un sacco didddddddddddd ddddddddddd cose belle alallalala sono andato a fare la spesa cacca pipi e tutto il resto fine messaggio
            </p>
        </div>

    );
}


export default Post;