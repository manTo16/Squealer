import React from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import ButtonBootstrap from 'react-bootstrap/Button'

export default function () {
  return (
    <div>
        <Container>
            <Form.Label> Your username</Form.Label>
            <InputGroup>
                <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                <Form.Control placeholder="type username here" aria-label="username"/>
            </InputGroup>
            <Form.Label> Your email </Form.Label>
            <InputGroup>
                <Form.Control placeholder="type email here" aria-label="email"/>
            </InputGroup>
            <Form.Label> Create a password </Form.Label>
            <InputGroup>
                <Form.Control placeholder="type password here" aria-label="password"/>
            </InputGroup>
            <Form.Label> Confirm Password </Form.Label>
            <InputGroup>
                <Form.Control placeholder="type password again" aria-label="confirm password"/>
            </InputGroup>
            <ButtonBootstrap type="submit" className='my-3'>Register</ButtonBootstrap>
        </Container>
    </div>
  )
}
