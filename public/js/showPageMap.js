mapboxgl.accessToken =
  'pk.eyJ1IjoiaHVlcnR6IiwiYSI6ImNsbDhtaHExZTA0Z3IzZ3RlcGJ1dmllMTQifQ.Km2el4IYqjGTy58LFEIRyQ';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

new mapboxgl.Marker().setLngLat([-74.5, 40]).addTo(map);
