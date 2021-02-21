//Query URL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// All the Maps
var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

var satMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var darkmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v9",
    accessToken: API_KEY
});
//MAP OBJECT
var myMap = L.map("mapid", {
    center: [
        40.7, -94.5
    ],
    zoom: 3,
    layers: [lightMap, streetmap, darkmap, satMap]
});

//SEIZMIC ACTIVITY DATA LAYER
var earthquakeMag = new L.LayerGroup();

d3.json(queryUrl, function(data){

    function formatColor(depth){
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
        return color;
    };
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: formatColor(feature.geometry.coordinates[2]),
            color: 'black',
            radius: feature.properties.mag * 3,
            stroke: true,
            weight: 0.5
        };
    }
    //GEOJASON LAYER
    L.geoJson(data, {
        //CREATE CIRCLE MARKERS ON THE MAP
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        //FORMAT CIRCLE MARKER
        style: styleInfo,
        //POPUP FOR MARKERS
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4>Location: </h4>"
                + feature.properties.place
                +"</h4>Magnitude: </h4>"
                + feature.properties.mag
                + "<h4>Depth: </h4>"
                + feature.geometry.coordinates[2]
                
            );
        }
     //ADD DATA TO EARTHQUAKE LAYER
    }).addTo(earthquakeMag);
   //ADD EARTHQUAKE LAYER TO MAP
    earthquakeMag.addTo(myMap);

    //LEGEND
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');

        div.innerHTML = `
        <div class="legend">Earthquake Depth
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
    //ADD LEGEND TO MAP
    legend.addTo(myMap);

});
//CREATE TECTONICPLATE LAYER
var faults = new L.layerGroup();

//URL TO CALL TECTONIC PLATE DATA
faultsURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
//CALL DATA TEC PLATES, FORMAT LINE
d3.json(faultsURL, function (response) {
    function faultStyle(feature) {
        return {
            weight: 2,
            color: "orange"
        };
    }
    //ADD TECTONIC PLATE INFO TO LAYER
    L.geoJSON(response, {
        style: faultStyle
    }).addTo(faults);
    faults.addTo(myMap)
})
//OVERLAYS OBJECT
var overlayMaps = {
    "Tectonic Plates": faults,
    "Earthquakes": earthquakeMag
};
//MAPS OBJECT 
var baseMaps = {
    "Light Map": lightMap, 
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satilite Map": satMap
     
};
//CONTROLS TO LAYERS
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);