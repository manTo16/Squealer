import React from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import ContainerBootstrap from 'react-bootstrap/Container'
import ButtonBootstrap from 'react-bootstrap/Button'

export default function Login() {
  return (
    <div>
      <ContainerBootstrap>
        <Form.Label> Username </Form.Label>
        <InputGroup>
            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
            <Form.Control placeholder="type username here" aria-label="username"/>
        </InputGroup>
        <Form.Label> Password </Form.Label>
        <InputGroup>
            <Form.Control placeholder="type password here" aria-label="password"/>
        </InputGroup>
        <ButtonBootstrap type="submit" className='my-3'>Log in</ButtonBootstrap>
      </ContainerBootstrap>
    </div>
  )
}
