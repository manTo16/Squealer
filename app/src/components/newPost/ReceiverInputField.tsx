import { Card } from "react-bootstrap"

import { useState, ChangeEvent } from "react";  

interface Props {
    _inputField: number;
    handleReceiverInputChange: (event: ChangeEvent<HTMLInputElement>, receiversArrayIndex: number) => void;
}


export default function ReceiverInputField(
    {_inputField, handleReceiverInputChange }: Props) {
  
    const [fieldId, setFieldId] = useState(_inputField);

    const [receiver, setReceiver] = useState("");

    return (
        <>
        <Card.Text>
            <input className="receiverInput bg-dark text-white"
            placeholder={`Destinatario n.${fieldId}`}
            type="text"
            onChange={(event)=>{handleReceiverInputChange(event, fieldId)}} />
        </Card.Text>
        </>
    )
}