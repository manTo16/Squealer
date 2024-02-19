 // Funzione per creare una mappa con le coordinate passate
export function createGeoMap(geolocation, area, mapId = null) {
    //check if geolocation.latitude and geolocation.longituted are null
    if (geolocation.latitude === null || geolocation.longitude === null || mapId === null) {
        console.error('Geolocation not valid');
        return '';
    }

    let map = L.map(mapId, {
        center: [geolocation.latitude, geolocation.longitude],
        zoom: 13,
        scrollWheelZoom: false,
        layers: [
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 20,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            L.marker([geolocation.latitude, geolocation.longitude])
        ]
    }).setView([geolocation.latitude, geolocation.longitude], 13);


    if(area){
        L.circle([geolocation.latitude, geolocation.longitude], {
            radius: 200,
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        }).addTo(map);
    }

    return map;
}