//Query URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
// Fetch the data from the API endpoint
d3.json(queryUrl).then(data => {
    // Once we get a response, send the data.features object to the createFeatures function

    // Zero in on the features property of your GEOJSON
    features = data['features'];

    // Create a map object
    var myMap = L.map("mapid", {
        center: [15.5994, -28.6731],
        zoom: 2
    });

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);

    features.forEach(feature => {
        // Conditionals for countries points
        var color = "";
        var lat = feature.geometry.coordinates[0];
        var long = feature.geometry.coordinates[1];
        var cord = [long, lat];
        var mag = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];

        if (depth > 100) {
            color = 'rgb(255, 50, 50)';
        }
        else if (depth > 75) {
            color = 'rgb(255, 120, 50)';
        }
        else if (depth > 50) {
            color = 'rgb(255, 180, 50)';
        }
        else if (depth > 25) {
            color = 'rgb(255, 255, 50)';
        }
        else if (depth > 10) {
            color = 'rgb(135, 250, 50)';
        }
        else if (depth > 5) {
            color = 'rgb(50, 255, 77)';
        }
        else {
            color = 'rgb(0, 206, 18)';
        }

        // Add circles to map
        L.circle(cord, {
            fillOpacity: 0.75,
            color: "white",
            fillColor: color,
            // Adjust radius
            radius: mag * 70000
        }).bindPopup(`<h3>${feature.properties.place}</h3><hr>${new Date(feature.properties.time)}`).addTo(myMap);
    });

    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');

        div.innerHTML = `
        <div class="legend">
            <div class="legend_item" style="background-color: rgba(255, 50, 50, .8);"><span>100+</span></div>  
            <div class="legend_item" style="background-color: rgba(255, 120, 50,.8);"><span>75-99</span></div>
            <div class="legend_item" style="background-color: rgba(255, 180, 50,.8);"><span>50-74</span></div>
            <div class="legend_item" style="background-color: rgba(255, 255, 50,.8);"><span>49-25</span></div>
            <div class="legend_item" style="background-color: rgba(135, 250, 50,.8);"><span>24-10</span></div>
            <div class="legend_item" style="background-color: rgba(50, 255, 77,.8);"><span>9-5</span></div>
            <div class="legend_item" style="background-color: rgba(0, 206, 18,.8);"><span>0-4</span></div> 
        </div>`;
        return div;
    };
    legend.addTo(myMap);
});