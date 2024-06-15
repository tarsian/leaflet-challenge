// Create the map object with options
var myMap = L.map('map', {
    center: [37.8, -96], // Central point of the map
    zoom: 3 // Zoom level
});

// Base layers for different visualizations
var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap); // Default base layer

var satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri &mdash; Sources: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Overlay layers
var earthquakes = new L.LayerGroup();
var tectonicPlates = new L.LayerGroup();

// Fetch earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: feature.properties.mag * 4,
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km<br>Location: " + feature.properties.place);
            }
        }).addTo(earthquakes);
    });

// Fetch tectonic plates data
fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            color: "#d35400",
            weight: 2
        }).addTo(tectonicPlates);
    });

// Color function for earthquake depth
function getColor(depth) {
    return depth > 90 ? '#FF0000' :
           depth > 70 ? '#FF4000' :
           depth > 50 ? '#FF8000' :
           depth > 30 ? '#FFBF00' :
           depth > 10 ? '#BFFF00' :
                        '#00FF00';
}

// Base maps
var baseMaps = {
    "Street Map": streetMap,
    "Satellite View": satelliteMap
};

// Overlay maps
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicPlates
};

// Layer control
L.control.layers(baseMaps, overlayMaps).addTo(myMap);
