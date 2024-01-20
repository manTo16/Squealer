import SearchBarPopup from '@components/Searchbar/SearchBarPopup';
import SearchLogo from '../svg/SearchSvg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default function Searchbar() {
  const navigate = useNavigate()

  const [showSearchBarPopup, setShowSearchBarPopup] = useState(false)

  return (
    <>
      <div className=" d-flex align-items-center flex-grow-1 my-2">
        <InputGroup className="">
          <Button variant='success' id="button-addon1" onClick={() => navigate("/")}>
            <SearchLogo />
          </Button>
          <Form.Control
            onClick={() => setShowSearchBarPopup(true)}
            placeholder='Trova amici, post o video'
            aria-label="Username"
          />
        </InputGroup>

        <SearchBarPopup show={showSearchBarPopup} handleShow={setShowSearchBarPopup} />
      </div>

    </>
  );
}