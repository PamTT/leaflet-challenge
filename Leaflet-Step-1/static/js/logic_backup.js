
// Store our API endpoint inside queryUrl
var quaryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


//Perform a GET request to the query url and send data.features object to the "creatFeatures function"
d3.json(quaryUrl, function(data) {
   console.log(data.features);

   createFeatures(data.features);
   
});

//Defind "createFeatures function"
function createFeatures(earthquakeData) {
  
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer){
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");   
  }
  function getRadius(magnitude) {
    return magnitude*4;
  }

  function fillColor(depth){
    //use switch statement
    return "#eecc00";







  }

  function stlyeInfo (feature){
    return {
      fillColor: getColor(feature.geometry.coordinates[2]),
      radius: getRadius(feature.properties.mag)



    };
  }

  var earthquakes = L.geoJson(earthquakeData, {
    pointToLayer: function(feature,latlng) {
      return L.circleMarker(latlng);
    },
    stlye: stlyeInfo,


    onEachFeature : onEachFeature
  });
  
  createMap(earthquakes);

}

function createMap(earthquakes) {
  //define streemap and darkmap layer
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
     accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  //// Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 5,
    layers: [streetmap,earthquakes]
  });

  //Create a layer control and pass in our baseMaps.  Add layrer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}


