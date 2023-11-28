import "./share.css"
import MediaButton from "../Button/MediaButton"
import LocationButton from "../Button/LocationButton";
import FeelingsButton from "../Button/FeelingsButton";
import TagButton from "../Button/TagButton";

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
                            <MediaButton className="shareIcon"/>
                            <span className="shareOptionText">Photo or video</span>
                        </div>
                        <div className="shareOption">
                            <MediaButton className="shareIcon"/>
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <LocationButton className="shareIcon"/>
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <FeelingsButton className="shareIcon"/>
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}