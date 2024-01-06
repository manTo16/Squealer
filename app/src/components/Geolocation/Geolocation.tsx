import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { Marker, Popup } from "react-leaflet";

export default function TestGeolocation() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setUserLocation({ latitude, longitude });
        },

        (error) => {
          console.error("Error get user location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    } 
  };

  return (
    <>
      <Row>
        <Col lg={6} xs={6}>
          <Button className="p-2 ms-auto btn-dark border-light" onClick={getUserLocation}>Posizione attuale</Button>
        </Col> 
        <Col lg={6} xs={6}>
          {userLocation && (
            <div>
              <h2>User Location</h2>
              <p>Latitude: {userLocation.latitude}</p>
              <p>Longitude: {userLocation.longitude}</p>
            </div>
          )}
        </Col>
      </Row>
      <hr/>
      <Row>
        <Col>
        <MapContainer center={[46.7334981, 12.2871083]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
        </Col>
      </Row>
    </>
  );
}