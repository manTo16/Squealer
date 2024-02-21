
import { Button } from "react-bootstrap"
import HomeButton from "../svg/BottomBarSvg/HomeButton"
import FireButton from "../svg/BottomBarSvg/FireButton"
import AddButton from "../svg/BottomBarSvg/AddButton"
import QuestionButton from "../svg/BottomBarSvg/QuestionButton"
import { useNavigate } from "react-router-dom"


export default function ThirdColumn() {
  const navigate = useNavigate()

    return(
        <div className="m-1 "
        //  className="d-flex flex-column align-items-start"
         >
          <Button 
            onClick={()=>{navigate("/")}} 
            variant="outline-light" 
            className="w-100 mb-1 d-flex justify-content-left align-items-center"
          >
            <HomeButton className="mx-2"/>
            <span className="mx-2">Home</span>
          </Button>

          <Button 
            onClick={()=>{navigate("/trendingPage")}} 
            variant="outline-light" 
            className="w-100 mb-1 d-flex justify-content-left align-items-center"
          >
            <FireButton className="mx-2"/>
            <span className="mx-2">Trending</span>
          </Button>

          <Button 
            onClick={()=>{navigate("/newPost")}} 
            variant="outline-light" 
            className="w-100 mb-1 d-flex justify-content-left align-items-center"
          >
            <AddButton className="mx-2"/>
            <span className="mx-2">New Post</span>
          </Button>

          <Button 
            onClick={()=>{navigate("/question")}}
            variant="outline-light"
            className="w-100 mb-1 d-flex justify-content-left align-items-center"
          >
            <QuestionButton className="mx-2"/>
            <span className="mx-2">§RANDOM</span>
          </Button>
        </div>
  );
}