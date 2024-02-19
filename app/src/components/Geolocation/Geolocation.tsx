import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, Circle } from 'react-leaflet'

function ChangeView({ center, zoom }: { center: LatLngTuple, zoom: number }) {
  const map = useMap();
  map.flyTo(center, zoom);
  return null;
}

interface MapProps {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TestGeolocation(
  { onChange }: MapProps
) {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const [locationObtained, setLocationObtained] = useState<boolean>(false);
  const [area, setArea] = useState(false);
  const startPosition: LatLngTuple = [44.66, 10.81];

  console.log("startPosition: ", startPosition);

  // ... (altro codice)

// Funzione per generare un numero casuale entro un intervallo
function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Funzione per convertire i gradi in radianti
function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

// Funzione per convertire i radianti in gradi
function radiansToDegrees(radians: number) {
  return radians * (180 / Math.PI);
}

// Funzione per ottenere nuove coordinate casuali all'interno del cerchio
function getRandomCoordinates(latitude: number, longitude: number, radius: number) {
  // Converti il raggio da metri a gradi terrestri
  const radiusInDegrees = radius / 111300;

  // Genera due numeri casuali per l'angolo e la distanza dal centro
  const u = Math.random();
  const v = Math.random();

  // Calcola le nuove coordinate
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  // Aggiungi le nuove coordinate alle coordinate originali
  const newLatitude = latitude + y;
  const newLongitude = longitude + x / Math.cos(degreesToRadians(latitude));

  return { latitude: newLatitude, longitude: newLongitude };
}

// ... (altro codice)

  const getUserLocation = () => {
    if (navigator.geolocation) {  // controlla se la geolocalizzazione è supportata dal browser
      navigator.geolocation.getCurrentPosition((position) => {  // ottiene la posizione corrente
          let { latitude, longitude } = position.coords;      // ottiene le coordinate

          if (area) {
            const randomCoordinates = getRandomCoordinates(latitude, longitude, 400); // 400 è il raggio del cerchio
            latitude = Number(randomCoordinates.latitude.toFixed(6));
            longitude = Number(randomCoordinates.longitude.toFixed(6));
          }

          setUserLocation({ latitude, longitude });             // aggiorna lo stato con le coordinate
          setLocationObtained(true);                            // aggiorna lo stato per indicare che la posizione è stata ottenuta
          area ? (
            onChange({ target: { value: (`${latitude}, ${longitude}, area`) } } as unknown as React.ChangeEvent<HTMLTextAreaElement>)
          ) : (
            onChange({ target: { value: (`${latitude}, ${longitude}`) } } as unknown as React.ChangeEvent<HTMLTextAreaElement>)
          )
        },

        (error) => {
          console.error("Error get user location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    } 
  };

  const isArea = () => {
    setArea(!area);
    console.log("Area: ", area);
  }

  const [mapWidth, setMapWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const mapContainer = document.getElementById('map-container');
      if (mapContainer) {
        const width = mapContainer.offsetWidth;
        setMapWidth(width);
      }
    };
    console.log("mapWidth: ", mapWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const position: LatLngTuple = [userLocation?.latitude || 44.66, userLocation?.longitude || 10.81];

  const polyline: LatLngTuple[] = [
    [51.505, -0.09] as LatLngTuple,
    [51.51, -0.1] as LatLngTuple,
    [51.51, -0.12] as LatLngTuple,
  ];
  const color = { color: 'red' }

  return (
    <>
      <Row>
        <Col xs={12} sm={6} className="d-flex flex-column align-items-center justify-content-center">
          <div className="d-flex flex-column">
          <Form>
            <Form.Check
              type='checkbox'
              id={`default-checkbox}`}
              label="Ottieni la tua posizione"
              onChange={getUserLocation}
            />
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Postare un'area?"
              onChange={isArea}
            />
          </Form>
          </div>
          {userLocation && (

            <div className="mt-2">
              <Row>
                <Col className="p-2" style={{ border: '1px solid white' }}>Coordinate</Col>
              </Row>  
              <Row>
                <Col className="p-2" style={{ border: '1px solid white' }}>Latitude</Col>
                <Col className="p-2" style={{ border: '1px solid white' }}>{userLocation.latitude}</Col>
              </Row>
              <Row>
                <Col className="p-2" style={{ border: '1px solid white' }}>Longitude</Col>
                <Col className="p-2" style={{ border: '1px solid white' }}>{userLocation.longitude}</Col>
              </Row>
            </div>
            
          )}
        </Col>
        <Col xs={12} sm={6} className="mt-2">
          <MapContainer 
            center={startPosition} 
            zoom={6}
            scrollWheelZoom={false} 
            style={{height: '400px'}}>
              {locationObtained && <ChangeView center={position} zoom={15} />}
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locationObtained && <Marker position={position}>A</Marker>}
              {area ? (
                    <Circle center={position} pathOptions={{color: 'red'}} radius={400} />
                ) : (
                    <></>
                )}
              {/* <Polyline pathOptions={color} positions={polyline} /> */}
              

          </MapContainer>
        </Col>
      </Row>
    </>
  );
}