import SearchLogo from '../svg/SearchSvg';
import './searchbar.css'; // Importa il file CSS per stili personalizzati

export default function Searchbar() {
  return (
    <div className="d-flex align-items-center flex-grow-1" style={{ padding: '10px' }}>
      <div className='searchBar flex-grow-1'> {/* Utilizzo di flex-grow per espandere l'input */}
        <SearchLogo className='searchIcon'/>
        <input
          placeholder='Trova amici, post o video'
          className='searchInput'
        />
      </div>
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