var myMap = L.map('map', {
    center: [37.8, -96], // Adjust this center point as needed
    zoom: 5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

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
        }).addTo(myMap);
    });

    function getColor(depth) {
        return depth > 90 ? '#FF0000' : // Red for the deepest earthquakes
               depth > 70 ? '#FF4000' : // Red-orange
               depth > 50 ? '#FF8000' : // Orange
               depth > 30 ? '#FFBF00' : // Yellow-orange
               depth > 10 ? '#BFFF00' : // Yellow-green
                            '#00FF00';  // Green for the shallowest depths
    }    

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 30, 50, 70, 90],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '; width:18px; height:18px; float:left; margin-right:8px; opacity:0.7;"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

legend.addTo(myMap);
