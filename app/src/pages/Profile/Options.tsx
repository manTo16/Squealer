import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

export default function Options() {
  const [isPro, setIsPro] = useState(false);
  
  const handleClick = () => {
      // Cambia lo stato opposto di isPro
      setIsPro(!isPro);
  };

  return(
    <Form className='bg-dark rounded p-2 m-1'>
      <h2 className='p-2'>Modifica profilo</h2>  
      <Row>
        <Col>
          <h4>Cambia Password</h4>
          <hr/>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Vecchia password</Form.Label>
              <Form.Control type="password" className='bg-dark text-light' placeholder="Password"/>
              <Form.Label>Nuova password</Form.Label>
              <Form.Control type="password" placeholder="Password" className='bg-dark text-light'/>
              <Form.Label>Conferma nuova passwor</Form.Label>
              <Form.Control type="password" placeholder="Password" className='bg-dark text-light'/>
              <p className='text-secondary pt-2' style={{fontSize: '11px'}}>Assicurati che la password sia di almeno 15 caratteri O che almeno 8 caratteri includendo numeri e lettere minuscole</p>
              <Button type="submit" className="btn btn-dark border-light">
                Cambia password 
              </Button>
          </Form.Group>
        </Col>
        <Col>
          <h4>Imposta il tipo di profilo</h4>
          <hr/>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Account pro?"
            checked={isPro}
            onChange={handleClick}
          />
          {isPro && (
            <Form.Select className='mt-1 btn btn-dark border-light'>
              <option value="1">Just PRO</option>
              <option value="2">Social Media Manager</option>
              <option value="3">Moderatore Squealer</option>
            </Form.Select>
          )}
        </Col>
      </Row>
      <br></br> 
    </Form>
  )
}