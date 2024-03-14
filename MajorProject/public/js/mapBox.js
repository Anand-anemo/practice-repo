
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM



// https://account.mapbox.com
let Token= mapToken ;
console.log(mapToken);
mapboxgl.accessToken = Token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geolocation.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});



const marker= new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geolocation.coordinates)
.setPopup(new mapboxgl.Popup({offset:25}).setHTML(
    `<p>Exact location provided after successful booking</p>`
))
.addTo(map);

