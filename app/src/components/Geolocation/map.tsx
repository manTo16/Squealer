import { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

interface MapProps {
    array: number[];
}

function Map({ array }: MapProps) {
    const position: LatLngTuple = [array[0], array[1]];

    // You can now use the 'array' prop inside your component

    return (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height: '400px'}}>
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