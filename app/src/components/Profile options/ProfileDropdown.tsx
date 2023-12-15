import ProfileSvg from "../svg/ProfileSvg";
import Dropdown from 'react-bootstrap/Dropdown';

export default function ProfileDropdown(){
    return(
        <Dropdown>
            <Dropdown.Toggle className="bg-transparent border-0 d-flex align-items-center">
                <ProfileSvg />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item></Dropdown.Item>
                <Dropdown.Item></Dropdown.Item>
            </Dropdown.Menu> 
        </Dropdown>
    );
}