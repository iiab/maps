// main.js for Admin Console using vector tiles for more detail
import {Fill, Stroke, Style} from 'ol/style';
import 'ol/ol.css';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import View from 'ol/View';
import {fromLonLat,toLonLat} from 'ol/proj';
import stylefunction from 'ol-mapbox-style/dist/stylefunction';
import {add} from 'ol/coordinate';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';

// load the regions checkbox
initMap();


// a global variable to control which features are shown
//window.$ = window.jQuery = require('jquery');
var show = {};
var mapData = "/admin/map";
var zoom = 3;
var lat = 37;
var lon = -122;
var radius = 50;
var boxcoords = [[[0,0],[0,1],[1,1],[1,0],[0,0]]];
var ptrcoords = [0,0];
var cmdline = '';

var map = new Map({ target: 'map-container',
  layers: [detail,satLayer,pointerLayer],
  //layers: [satLayer],
  view: new View({
    center: fromLonLat([-122.24,37.45]),
    zoom: 2
  })
}); //end of new Map
window.map = map
var view = map.getView();

var satLayer = new VectorLayer({
    style: new Style({
       stroke: new Stroke({
         color: 'rgb(255, 140, 0, 1)'
       })
    }), 
    source: getBoxSource()
 });

var pointerLayer = new VectorLayer({
    style: new Style({
       stroke: new Stroke({
         color: 'rgb(115, 77, 38)'
       })
    }), 
    source: getBoxSource()
 });

var detail = new VectorTileLayer({
   source: new VectorTileSource({
      format: new MVT(),
      url: `./tileserver.php?./detail/{z}/{x}/{y}.pbf`,
      minZoom: 0,
      attributions: ['&copy <a href="https://openstreetmap.org">OpenStreetMaps, </a> <a href="https://openmaptiles.com"> &copy OpenMapTiles</a>'
      ]
      //maxZoom: 14
   }),
   declutter: true,
});

map.on("pointermove", function(evt) {
    ptrcoords = toLonLat(evt.coordinate);
    lat = ptrcoords[1];
    lon = ptrcoords[0];
    //satLayer.getSource().clear();
    //update_satbox(evt);
    pointerLayer.setSource(getBoxSource());
    pointerLayer.changed();  
 });


 map.on("click", function(evt) {
    var coords = toLonLat(evt.coordinate);
    lat = coords[1];
    lon = coords[0];
    satLayer.setSource(getBoxSource());
    satLayer.changed();  
    //console.log("center changed to lon:" + lon.toFixed(2) + '  lat:' + lat.toFixed(2));
    document.getElementById('cmdline_element').innerHTML = "sudo iiab-extend-sat.py --lon " + lon.toFixed(4) + ' --lat ' + lat.toFixed(4) + ' --radius ' + radius;
 
 });

 
var cmdline_element = {};
$( document ).ready(function() {
    console.log( "ready!" );
    document.getElementById('cmdline_element').innerHTML = "sudo iiab-extend-sat.py";
    document.getElementById('instr').innerHTML = "First Install at least one of the regions on the left of this window.<br>Then to increase satellite detailed coverage, copy the instructions below, become root, and paste them into a terminal window.";
});