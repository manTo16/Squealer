import { Card } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useState, ChangeEvent } from "react";  

interface Props {
    _inputField: number;
    handleReceiverInputChange: (event: ChangeEvent<HTMLInputElement>, receiversArrayIndex: number, receiverType: string) => void;
}


export default function ReceiverInputField(
    {_inputField, handleReceiverInputChange }: Props) {
  
    const [fieldId, setFieldId] = useState(_inputField);

    const [receiver, setReceiver] = useState("");

    const [selectedReciver, setSelectedReciver] = useState('to');

    const handleSelect = (eventKey: string | null) => {
        if (eventKey === null) return; // Check for null

        switch (eventKey) {
            case 'user':
                setSelectedReciver('@');
                break;
            case 'channel':
                setSelectedReciver('§');
                break;
        }
    };

    return (
        <>
        <InputGroup className="mb-3">
            {/* <InputGroup.Text id="basic-addon1">@</InputGroup.Text> */}
            <DropdownButton
                variant="light"
                title={selectedReciver}
                onSelect={handleSelect as any} // Casting handleSelect to any temporarily
                >
                <Dropdown.Item eventKey="user">@ - User</Dropdown.Item>
                <Dropdown.Item eventKey="channel">§ - Channel</Dropdown.Item>
            </DropdownButton>
            <Form.Control
            placeholder={`Destinatario n.${fieldId}`}
            className="bg-dark text-white"
            aria-label="Username"
            aria-describedby="basic-addon1"
            as="input"
            onChange={(event:React.ChangeEvent<HTMLInputElement>)=>
                {handleReceiverInputChange(event, fieldId, selectedReciver)}}
            />
        </InputGroup>
        </>
    )
}