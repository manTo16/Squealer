
import { Button } from "react-bootstrap"
import HomeButton from "../svg/BottomBarSvg/HomeButton"
import FireButton from "../svg/BottomBarSvg/FireButton"
import AddButton from "../svg/BottomBarSvg/AddButton"
import QuestionButton from "../svg/BottomBarSvg/QuestionButton"
import { useNavigate } from "react-router-dom"


export default function ThirdColumn() {
  const navigate = useNavigate()

    return(
        <div className="buttons-wrapper d-flex flex-column align-items-start">
          <Button onClick={()=>{navigate("/")}} variant="outline-light" className="w-50 d-flex align-items-center m-1">
            <HomeButton className="mx-2"/>
            <span className="mx-2">Home</span>
          </Button>

          <Button onClick={()=>{navigate("/trendingPage")}} variant="outline-light" className="w-50 d-flex align-items-center m-1">
            <FireButton className="mx-2"/>
            <span className="mx-2">Trending</span>
          </Button>

          <Button onClick={()=>{navigate("/newPost")}} variant="outline-light" className="w-50 d-flex align-items-center m-1">
            <AddButton className="mx-2"/>
            <span className="mx-2">New Post</span>
          </Button>

          <Button variant="outline-light" className="w-50 d-flex align-items-center m-1">
            <QuestionButton className="mx-2"/>
            <span className="mx-2">Question</span>
          </Button>

        </div>
  );
}