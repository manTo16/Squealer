
import { Button } from "react-bootstrap"
import HomeButton from "../svg/BottomBarSvg/HomeButton"
import FireButton from "../svg/BottomBarSvg/FireButton"
import AddButton from "../svg/BottomBarSvg/AddButton"
import QuestionButton from "../svg/BottomBarSvg/QuestionButton"
import GroupButton from "../svg/BottomBarSvg/GroupButton"


export default function ThirdColumn() {
    return(
      <>
        <div className="buttons-wrapper d-flex flex-column align-items-start">
          <Button variant="outline-light" href="/" className="w-50 d-flex align-items-center">
            <HomeButton />
            <span className="ml-2">Home</span>
          </Button>

          <Button variant="outline-light" href="/trendingPage" className="w-50 d-flex align-items-center">
            <FireButton />
            <span className="ml-2">Trending</span>
          </Button>

          <Button variant="outline-light" href="/newPost" className="w-50 d-flex align-items-center">
            <AddButton />
            <span className="ml-2">New Post</span>
          </Button>

          <Button variant="outline-light" className="w-50 d-flex align-items-center">
            <QuestionButton />
            <span className="ml-2">Question</span>
          </Button>

          <Button variant="outline-light" className="w-50 d-flex align-items-center">
            <GroupButton />
            <span className="ml-2">Group</span>
          </Button>
        </div>
      </>
  )
}