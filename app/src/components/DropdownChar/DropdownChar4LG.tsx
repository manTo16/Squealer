import React, { useState } from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';

var Dchar = 69;
var Wchar = 104;
var Mchar = 420;

export default function DropdownCharSM() {
    const [selectedChar, setSelectedChar] = useState('Caratteri');

    const handleSelect = (eventKey: string | null) => {
        if (eventKey === null) return; // Check for null

        switch (eventKey) {
            case 'daily':
                setSelectedChar('D: ' + Dchar);
                break;
            case 'weekly':
                setSelectedChar('W: ' + Wchar);
                break;
            case 'monthly':
                setSelectedChar('M: ' + Mchar);
                break;
            default:
                setSelectedChar('Caratteri');
                break;
        }
    };

    return (
        <div>
            <NavDropdown
                align="end"
                title={selectedChar}
                id="collapsible-nav-dropdown"
                style={{ padding: '10px' }}
                className='d-none d-lg-block'
                onSelect={handleSelect as any} // Casting handleSelect to any temporarily
            >
                <NavDropdown.Item eventKey="daily">D: {Dchar}</NavDropdown.Item>
                <NavDropdown.Item eventKey="weekly">W: {Wchar}</NavDropdown.Item>
                <NavDropdown.Item eventKey="monthly">M: {Mchar}</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Buy some more</NavDropdown.Item>
            </NavDropdown>
        </div>
    );
}