import "./share.css"
import MediaSvg from "../svg/MediaSvg"
import LocationSvg from "../svg/LocationSvg";
import FeelingsSvg from "../svg/FeelingsSvg";
import TagSvg from "../svg/TagSvg"

export default function Share() {
    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src="/assets/person/1.png" alt="" />
                    <input 
                        placeholder="Squillo calde nei paraggi"
                        className="shareInput"
                    />
                </div>
                <hr className="shareHr"/>
                <div className="shareBottom">
                    <div className="shareOptions">
                        <div className="shareOption">
                            <MediaSvg className="shareIcon"/>
                            <span className="shareOptionText">Photo or video</span>
                        </div>
                        <div className="shareOption">
                            <MediaSvg className="shareIcon"/>
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <LocationSvg className="shareIcon"/>
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <FeelingsSvg className="shareIcon"/>
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}