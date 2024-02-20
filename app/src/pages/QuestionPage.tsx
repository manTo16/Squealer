// import Logo from '../assets/Squealer.png'

import Feed from "@components/Feed/Feed";

const QuestionPage = () => {
  return (
    <div>
        <h1>Feed random</h1>
        <Feed randomFeed={true} />
        {/* <img src={Logo} alt="logo" width={500} className='py-4'/> */}
    </div>  
  );
};

export default QuestionPage;