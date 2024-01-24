import Collapse from "react-bootstrap/Collapse"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Dropdown from "react-bootstrap/Dropdown"
import Fade from "react-bootstrap/Fade"

import { useState, useEffect } from "react"

interface AdvancedOptionsProps {
    handleRepeatIntervalChange: (value: number) => void
    handleIntervalTimeUnitChange: (unit: string) => void   //unit:= Minuti | Ore | Giorni
}

export default function AdvancedOptions({
    handleRepeatIntervalChange, handleIntervalTimeUnitChange
} : AdvancedOptionsProps) {

    const [showCollapse, setShowCollapse] = useState(false)

    const [repeatPostCheckboxValue, setRepeatPostCheckboxValue] = useState(false)

    const [repeatInterval, setRepeatInterval] = useState("")
    const [intervalTimeUnit, setIntervalTimeUnit] = useState("Minuti")  

    
    const handleTimeIntervalInputChange = (input: string) => {
        input = input.replace(/\D/g, '')
        while (input.startsWith("0")) input = input.slice(1)
        setRepeatInterval(input)
        handleRepeatIntervalChange(parseInt(input ? input : "0"))
    }

    const intervalTimeUnitInputChange = (input: string) => {
        setIntervalTimeUnit(input)
        handleIntervalTimeUnitChange(input)
    }

    useEffect(() => {
        if (!repeatPostCheckboxValue) handleTimeIntervalInputChange("0")
    }, [repeatPostCheckboxValue])
    

    return (
        <>

        <Button variant="dark" onClick={() => setShowCollapse(!showCollapse)}>
            Mostra impostazioni avanzate
        </Button>

        <Collapse in={showCollapse} className="mt-3">
            <div>
                <Form.Check
                className="mb-2"
                type="checkbox"
                label="Ripeti post"
                checked={repeatPostCheckboxValue}
                onChange={() => setRepeatPostCheckboxValue(!repeatPostCheckboxValue)} />

                <Fade in={repeatPostCheckboxValue} >
                    <div className="d-flex">
                    Ogni <Form.Control value={repeatInterval} onChange={(e) => handleTimeIntervalInputChange(e.target.value)} /> 
                    <span>
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-light">
                                {intervalTimeUnit}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item 
                                onClick={() => intervalTimeUnitInputChange("Minuti")}>
                                    Minuti
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => intervalTimeUnitInputChange("Ore")}>
                                    Ore
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => intervalTimeUnitInputChange("Giorni")}>
                                    Giorni
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </span>
                    </div>
                </Fade>
            </div>
        </Collapse>
        </>
    )
}