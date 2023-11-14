import { Button, Col, Container, Form, Row } from "react-bootstrap";




function Searchbar () {
    return (
        <Container className="mt-5">
            <Form className="d-flex">
                
                <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 rounded-pill"
                aria-label="Search"
                
                />
                
                <Button className="rounded-pill"
                variant="outline-primary"
                >
                    Search
                </Button>
                
            </Form>
        </Container>
    );
}

export default Searchbar;



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
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        />
                    </svg>
                
                </Button>
                    


*/