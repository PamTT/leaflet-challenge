// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
var queryT_Plate = ""
// Grap data with d3 from queryURL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data);
  console.log(data.features);
  console.log("depth: "+data.features[1].geometry.coordinates[2])


  /////////stop here
  // for (var i = 0; i < data.length; i++) {
  //   var magnitude = data.features[i].properties.mag;

  //   if (magnitude){
  //     L.marker([])
  //   }


  }
);
///////////till here
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +", Magnitude:" +(feature.properties.mag)
    +", Depth:" + (feature.geometry.coordinates[2])+
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function getRadius(magnitude) {
    if (magnitude === 0){
      return 1;
    }
    return magnitude*4;
  }

  //function fill color
  function depthColor(depth) {
    switch (true) {
      case depth > 90: return "#DC143C";
      case depth > 70: return "#FF7F50";
      case depth > 50: return "#D2691E";
      case depth > 30: return "#7FFF00";
      case depth > 10: return "#FFEBCD";
      default: return "#7FFFD4";
    }
  }

  //function styleInfo
  function styleInfo (feature){
    return {
      fillColor: depthColor(feature.geometry.coordinates[2]),
      radius: getRadius(feature.properties.mag),
      color: "#000000",
      fillOpacity: 1,
      opacity: 1,
      weight: 0.5,
      stroke: true
    };
  }




  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature,latlng) {
      return L.circleMarker(latlng);
    },

    style: styleInfo,

    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
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

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  //setup legend
  var legend = L.control( {position: "bottomright"});
  
  legend.onAdd = function(){

    var div = L.DomUtil.create("div","info legend");
    var colorScales = [-10,10,30,50,70,90];
    var colors = ["#7FFFD4","#FFEBCD","#7FFF00","#D2691E", "#FF7F50","#DC143C"];

    for (var i = 0; i < colorScales.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
        + colorScales[i] + (colorScales[i + 1] ? "&ndash;" + colorScales[i + 1] + "<br>" : "+");
    }
    console.log(div);
    return div;
  };

  //add legend to myMap
  legend.addTo(myMap);

}

