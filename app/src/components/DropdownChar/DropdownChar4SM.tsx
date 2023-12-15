import NavDropdown from 'react-bootstrap/NavDropdown';
import ProfileSM from '../Profile options/ProfileSM';

var Dchar = 69;
var Wchar = 104;
var Mchar = 420;

export default function DropdownCharSM () {
    return(
    <div>
        <NavDropdown 
            align="end"
            title="Caratteri"
            id="collapsible-nav-dropdown"
            style={{ padding: '10px' }}
            className='d-lg-none'
          >

          <NavDropdown.ItemText>Daily: {Dchar}</NavDropdown.ItemText>
          <NavDropdown.ItemText>Weekly: {Wchar}</NavDropdown.ItemText>
          <NavDropdown.ItemText>Monthly: {Mchar}</NavDropdown.ItemText>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Buy some more</NavDropdown.Item>
        </NavDropdown>
        <ProfileSM/>
    </div>
    );
}