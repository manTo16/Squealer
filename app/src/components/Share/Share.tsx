import CardFooter from 'react-bootstrap/CardFooter'
import propic from "../../assets/person/1.png"
import LocationSvg from "../svg/LocationSvg";
import FeelingsSvg from "../svg/FeelingsSvg";
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import MediaSvg from "../svg/MediaSvg"
import TagSvg from "../svg/TagSvg"
import "./share.scss"

export default function Share() {

    var Dchar = 1024;

    var Msg;

    const [charCount, setCharCount] = useState(0);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = event.target.value;
        setCharCount(inputText.length);
    };

    return (

        <Card>
            <Card.Header>
            <div className="tags">
                <img className="shareProfileImg" src={propic} alt="" />
                <span className="displayedName">Repubblica</span>
                <span className="tagName">@Repubblica</span>
                <span className="charLeft">{charCount}</span>
            </div>
            </Card.Header>
            <Card.Body>
                <Card.Title>Squillami tutto</Card.Title>
                <Card.Text>
                <textarea
                    placeholder="Squillo calde nei paraggi"
                    className="shareInput"
                    rows={4}
                    maxLength={Dchar}               // sostituire coi caratteri giornalieri
                    onChange={handleInputChange}    // visualizza quanti caratteri sono stati inseriti
                />
                </Card.Text>
                <CardFooter>
                    <Button variant="primary">Media</Button>
                    <Button variant="primary">Tag</Button>
                    <Button variant="primary">Location</Button>
                    <Button variant="primary">Feelings</Button>
                    <Button variant="primary">Post</Button>
                </CardFooter>
            </Card.Body>
        </Card>
        
        // <div className="share">
        //     <div className="shareWrapper">
                
        //         <div className="shareTop">
        //             <img className="shareProfileImg" src="/assets/person/1.png" alt="" />
        //             <div className="rightTop">
        //                 <div className="tags">
        //                     <span className="displayedName">Repubblica</span>
        //                     <span className="tagName">@Repubblica</span>
        //                     <span className="charLeft">{charCount}</span>
        //                 </div>
        //                 <textarea
        //                     placeholder="Squillo calde nei paraggi"
        //                     className="shareInput"
        //                     rows={4}
        //                     maxLength={Dchar}               // sostituire coi caratteri giornalieri
        //                     onChange={handleInputChange}    // visualizza quanti caratteri sono stati inseriti
                            
        //                 />
        //             </div>
        //         </div>
        //         {/* ----------------------- */}
                
        //         <hr className="shareHr"/>
        //         <div className="shareBottom">
        //             <div className="shareOptions">
        //                 <div className="shareOption">
        //                     <MediaSvg className="shareIcon"/>
        //                     <span className="shareOptionText">Media</span>
        //                 </div>
        //                 <div className="shareOption">
        //                     <TagSvg className="shareIcon"/>
        //                     <span className="shareOptionText">Tag</span>
        //                 </div>
        //                 <div className="shareOption">
        //                     <LocationSvg className="shareIcon"/>
        //                     <span className="shareOptionText">Location</span>
        //                 </div>
        //                 <div className="shareOption">
        //                     <FeelingsSvg className="shareIcon"/>
        //                     <span className="shareOptionText">Feelings</span>
        //                 </div>
        //             </div>
        //             <button className="shareButton">Share</button>
        //         </div>
        //     </div>
        // </div>
    );
}