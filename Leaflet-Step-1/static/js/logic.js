//// Create our map object centered at Minneapolis
var myMap = L.map("map", {
  center: [44.9778, -93.2650],
  zoom: 10,
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint inside queryUrl
var url1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(depth) {
  switch (true) {
    case (depth>-10) && (depth<=10):
    return "yellow";
  case (depth>10) && (depth<=30):
    return "green";
  case (depth>30) && (depth<=50):
    return "orange";
  case (depth>50) && (depth<=70):
    return "gold";
  case (depth>70) && (depth<=90):
    return "purple";
  case (depth >90):
    return "red";
  }
}

// Perform a GET request to the query URL
d3.json(url1, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define streetmap layer
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  //define darkmap layer
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

}