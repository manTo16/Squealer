import { Col, Row, Stack } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState, useContext } from 'react';
import { UserContext } from '@utils/userData';
import IconWarning from '@components/svg/WarningSvg';
import { deleteAccount } from '@root/axiosConfig';

export default function Options() {
  const [isPro, setIsPro] = useState(false);
  const [isVer, setIsVer] = useState(false);
  const [show, setShow] = useState(false);

  const { userDetails } = useContext(UserContext)

  const handleClose = () => setShow(!show);
  
  const handleVerClick = () => {
    setIsVer(!isVer);
    // andare a modificare le impostazioni del profilo
  }

  const handleProClick = () => {
      // Cambia lo stato opposto di isPro
      setIsPro(!isPro);
  };

  const handleDelete = () => {
    const userID = userDetails._id;
    console.log(userID);
    (async () => {
      const result = await deleteAccount(userID);
    })();
  }

  return(
    <>
      <Form className='bg-dark rounded p-2'>
        <h2 className='p-2'>Modifica profilo</h2>  
        <hr />
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
                <Button type="submit" className="btn btn-dark border-light mt-1" disabled>
                  Cambia password 
                </Button>
            </Form.Group>
          </Col>
          <Col>
            <h4>Imposta il tipo di profilo</h4>
            <hr/>
            <div className='m-2'>
              <Form.Check
                type="switch"
                id="Pro-switch"
                label="Account pro?"
                checked={isPro}
                onChange={handleProClick}
              />
              {isPro && (
                <Form.Select className='mt-1 btn btn-dark border-light'>
                  <option value="1">Just PRO</option>
                  <option value="2">Social Media Manager</option>
                  <option value="3">Moderatore Squealer</option>
                </Form.Select>
              )}
              <hr/>
              <Form.Check
                type="switch"
                id="verified-switch"
                label="Verificato?"
                checked={isVer}
                onChange={handleVerClick}
              />
            </div>
          </Col>
        </Row>
        <hr/>
          <Stack direction='horizontal'>
            <h2 className='text-danger'>Elimina account</h2>
            <Button 
              className='btn-danger ms-auto mx-3' 
              onClick={handleClose}
            >
              Elimina
            </Button>
          </Stack>
        <br></br> 
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <IconWarning/>
            Vuoi eliminare il tuo account?
            <IconWarning/>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annulla
          </Button>
          <Button variant="warning" className='text-black' onClick={handleDelete}>
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}