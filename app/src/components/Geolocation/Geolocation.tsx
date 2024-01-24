import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

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
  const startPosition: LatLngTuple = [44.66, 10.81];

  console.log("startPosition: ", startPosition);

  const getUserLocation = () => {
    if (navigator.geolocation) {  // controlla se la geolocalizzazione è supportata dal browser
      navigator.geolocation.getCurrentPosition((position) => {  // ottiene la posizione corrente
          const { latitude, longitude } = position.coords;      // ottiene le coordinate

          setUserLocation({ latitude, longitude });             // aggiorna lo stato con le coordinate
          setLocationObtained(true);                            // aggiorna lo stato per indicare che la posizione è stata ottenuta
          onChange({ target: { value: (`${latitude}, ${longitude}`) } } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
          // onChange({ target: { value: (`sono a queste coordinate ${latitude}, ${longitude}`) } } as unknown as React.ChangeEvent<HTMLTextAreaElement>);
        },

        (error) => {
          console.error("Error get user location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    } 
  };

  const position: LatLngTuple = [userLocation?.latitude || 44.66, userLocation?.longitude || 10.81];

  return (
    <>
      <Row>
        <Col lg={6} xs={6}>
          <Button 
            className="p-2 ms-auto"
            variant="success" 
            onClick={getUserLocation}
          >
            Posizione attuale
          </Button>
        </Col> 
        <Col lg={6} xs={6}>
          {userLocation && (
            <div>
              <h2>User Location</h2>
              <div className="d-flex flex-row">
                <p className="mx-3">Latitudine: {userLocation.latitude}</p>
                <p>Longitudine: {userLocation.longitude}</p>
              </div>
            </div>
          )}
        </Col>
      </Row>
      <hr/>
      <Row>
        <Col>
          <MapContainer 
            center={startPosition} 
            zoom={6}
            scrollWheelZoom={false} 
            style={{height: '400px'}}>
              {locationObtained && <ChangeView center={position} zoom={16} />}
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locationObtained && <Marker position={position}>A</Marker>}
          </MapContainer>
        </Col>
      </Row>
    </>
  );
}