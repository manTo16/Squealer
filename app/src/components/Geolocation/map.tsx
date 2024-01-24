import React, { useState } from "react";
import { Icon, LatLngTuple, divIcon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

interface MapProps {
    crd: string;
}

function Map({ crd }: MapProps) {
    
    const [userLocation, setUserLocation] = useState<{
        latitude: number;
        longitude: number;
      } | null>(null);

    function coordinatesToLatLngTuple(coordinates: string): LatLngTuple {
        const parts = coordinates.split(', ');
        return [parseFloat(parts[0]), parseFloat(parts[1])];
    }

    const position: LatLngTuple = coordinatesToLatLngTuple(crd);

    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height: '250px'}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
            </Marker> 
        </MapContainer>
    );
}

export default Map;