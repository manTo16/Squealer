import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
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

  const isArea = () => {
    setArea(true);
    console.log("Area: ", area);
  }


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
        <Col className="d-flex flex-row">
          <div className="d-flex flex-column">
            <Button 
              className="p-2 ms-auto"
              variant="success" 
              onClick={getUserLocation}
            >
              Posizione attuale
            </Button>
            <Button
              className="p-2 ms-auto w-100 mt-2"
              variant="success" 
              onClick={isArea}
            >
              Area?
            </Button>
          </div>
          {userLocation && (
            <div className="d-flex ms-auto justify-content-end">
              <table style={{ border: '1px solid white' }}>
                <tbody>
                  <tr>
                    <th rowSpan={2} className="p-2" style={{ border: '1px solid white' }}>Coordinate</th>
                    <th className="p-2" style={{ border: '1px solid white' }}>Latitude</th>
                    <th className="p-2" style={{ border: '1px solid white' }}>{userLocation.latitude}</th>
                  </tr>
                  <tr>
                    <th className="p-2" style={{ border: '1px solid white' }}>Longitude</th>
                    <th className="p-2" style={{ border: '1px solid white' }}>{userLocation.longitude}</th>
                  </tr>
                  <tr>
                    <td className="p-2" style={{ border: '1px solid white' }}>Area</td>
                    <td className="p-2" colSpan={2} style={{ border: '1px solid white' }}>Si</td>
                  </tr>
                </tbody>
              </table>
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

              {/* <Polyline pathOptions={color} positions={polyline} /> */}
              

          </MapContainer>
        </Col>
      </Row>
    </>
  );
}