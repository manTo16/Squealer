import SearchBarPopup from '@components/Searchbar/SearchBarPopup';
import SearchLogo from '../svg/SearchSvg';
import './searchbar.css'; // Importa il file CSS per stili personalizzati
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap/lib/InputGroup';

export default function Searchbar() {
  const navigate = useNavigate()

  const [showSearchBarPopup, setShowSearchBarPopup] = useState(false)

  return (
    <div className="d-flex align-items-center flex-grow-1" style={{ padding: '10px' }}>
      <div className='searchBar flex-grow-1'> {/* Utilizzo di flex-grow per espandere l'input */}
        <SearchLogo className='searchIcon' onClick={() => navigate("/")}/>
        <input onClick={() => setShowSearchBarPopup(true)}
          placeholder='Trova amici, post o video'
          className='searchInput'
        />
      </div>

      <SearchBarPopup show={showSearchBarPopup} handleShow={setShowSearchBarPopup} />
    </div>
  );
}



/*

bottone da mettere eventualmente dentro il <Form> sotto il <Form.Control>
l'elemento svg genera una lente d'ingrandimento, tipo immagine
usa "path" che praticamente è una roba html per fare dei disegnini

                <Button className="rounded-pill" 
                variant="outline-primary"
                size='sm'>
                    
                    <svg
                    
                        >
                        <path d="M14.386 14.386l4.0877 
                        4.0877-4.0877-4.0877c-2.9418 
                        2.9419-7.7115 2.9419-10.6533 
                        0-2.9419-2.9418-2.9419-7.7115 
                        0-10.6533 2.9418-2.9419 7.7115-2.9419 
                        10.6533 0 2.9419 2.9418 2.9419 7.7115 
                        0 10.6533z" 
                        stroke="currentColor" 
                        fill="none" 

                        //questi 3 non cambiano nulla, bho
                        fill-rule="evenodd" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        />
                    </svg>
                
                </Button>
                    


*/