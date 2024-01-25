import React from "react";
import { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, Marker, Polyline, Circle } from 'react-leaflet'
import { cookies } from "next/headers";

interface MapProps {
    coordinates: string;
    isArea: boolean;
}

function coordinatesArrayToLatLngTuples(coordinates: string): LatLngTuple[] {
    const coordinatesArray: string[] = splitStringByPlus(coordinates)
  
    return coordinatesArray.map(coordinates => {
        const parts = coordinates.split(',');
        return [parseFloat(parts[0]), parseFloat(parts[1])] as LatLngTuple;
    });
  }
  
function splitStringByPlus(input: string): string[] {
    return input.split('+');
}


function Map({ coordinates, isArea }: MapProps) {
    const crd: LatLngTuple[] = coordinatesArrayToLatLngTuples(coordinates);
    const center: LatLngTuple = crd[crd.length - 1];

    return (
        <>
        <MapContainer 
            center={center} 
            zoom={13} 
            scrollWheelZoom={false}
            style={{height: '300px'}}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* {crd.map((position, index) => (
                <Marker key={index} position={position}></Marker>
            ))} */}
            <Marker position={center}></Marker>

            <Polyline pathOptions={{color: 'blue'}} positions={crd} />
            {
                isArea ? (
                    <Circle center={crd[0]} pathOptions={{color: 'red'}} radius={400} />
                ) : (
                    <></>
                )
            }

        </MapContainer>
        </>
    );
}

export default Map;