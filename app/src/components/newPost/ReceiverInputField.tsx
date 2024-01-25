import { FloatingLabel } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useState, ChangeEvent, useEffect } from "react";  

interface Props {
    _inputField: number;
    handleReceiverInputChange: (receiver: string, receiversArrayIndex: number, receiverType: string) => void;
}


export default function ReceiverInputField(
    {_inputField, handleReceiverInputChange }: Props) {
  
    const [fieldId, setFieldId] = useState(_inputField);


    const [inputText, setInputText] = useState("")
    const [selectedReciver, setSelectedReciver] = useState('to');
    const [thersDest, setThersDest] = useState('warning');
    const [Dest, setDest] = useState('to');

    const handleSelect = (eventKey: string | null) => {
        if (eventKey === null) return; // Check for null

        switch (eventKey) {
            case 'user':
                setSelectedReciver('@');
                setThersDest('light');
                setDest('User');
                break;
            case 'channel':
                setSelectedReciver('§');
                setThersDest('light');
                setDest('Channel');
                break;
            case 'keyword':
                setSelectedReciver('#');
                setThersDest('light');
                setDest('Keyword');
        }
    };

    const handleThisInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputText(event.target.value)
    }

    //manda il testo all'elemento padre quando cambia o il testo o il destinatario
    useEffect(() => {
        handleReceiverInputChange(inputText, fieldId, selectedReciver)
    }, [inputText, selectedReciver])

    return (
        <>
        <InputGroup className="m-1">
            <DropdownButton
                variant={thersDest}
                title={selectedReciver}
                onSelect={handleSelect as any}
                >
                <Dropdown.Item eventKey="user">
                    <div className="d-flex flex-row">
                        <div>
                          @
                        </div>
                        <div className=" mx-3"/>
                        <div className="ms-auto">User</div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="channel">
                    <div className="d-flex flex-row">
                        <div>
                            §
                        </div>
                        <div className=" mx-3"/>
                        <div className="ms-auto">Channel</div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item eventKey="keyword">
                    <div className="d-flex flex-row">
                        <div>
                            #
                        </div>
                        <div className=" mx-3"/>
                        <div className="ms-auto">Keyword</div>
                    </div>
                </Dropdown.Item>
            </DropdownButton>
            <FloatingLabel
                controlId="floatingInput"
                label={`${Dest} n.${fieldId}`}
            >
                <Form.Control
                    className="bg-dark text-white"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    as="input"
                    autoFocus
                    onChange={(event:React.ChangeEvent<HTMLInputElement>)=>
                        {handleThisInputChange(event)}}
                />
            </FloatingLabel>
        </InputGroup>
        </>
    )
}