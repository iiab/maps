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

//fetch(mapData + '/style-osm.json').then(function(response) {
fetch('./style-osm.json').then(function(response) {
   response.json().then(function(glStyle) {
     stylefunction(detail, glStyle,"openmaptiles");
   });
});


var setBoxStyle = function(feature) {
  var name = feature.get("name");
  //alert(keys+'');
  if (typeof show !== 'undefined' &&
       show != null && name == show) {
    return new Style({
      fill: new Fill({
        color: 'rgba(67, 163, 46, 0.2)'
      }),
      stroke: new Stroke({
        color: 'rgba(67, 163, 46, 1)',
        width: 2
      })
    })
  } else {
    return new Style({
      fill: new Fill({
        color: 'rgba(255,255,255,.10)'
      }),
      stroke: new Stroke({
        color: 'rgba(255,255,255,.3)'
      })
    })
  }
}

const boxLayer =  new VectorLayer({ 
   source: new VectorSource({
     format: new GeoJSON(),
     url: '../viewer/assets/bboxes.geojson'
   }),
   style: setBoxStyle
/*
function(feature) {
     var name = feature.get("name");
     var found = false;
      if (name.startsWith('sat')) {
       return new Style({
         fill: new Fill({
           color: 'rgba(67, 163, 46, 0)'
         }),
         stroke: new Stroke({
           color: 'rgba(250, 200, 20, 1)',
           width: 2
         })
      })
     }
   } 
*/
})

function get_box_coords(radius,lon,lat){
   // go to polar coords -- Math functions want and provide in radians
   var deltaY = Math.asin(radius / 6378000.0);
   //console.log('deltaYradians'+deltaY);
   var lat_rad = lat * Math.PI /180;
   var deltaX = deltaY / Math.cos(lat_rad);
   var lon_rad = lon * Math.PI / 180;
   var west = (lon_rad - deltaX) * 180 / Math.PI;
   var south = (lat_rad - deltaY) * 180 / Math.PI;
   var east = (lon_rad + deltaX) * 180 / Math.PI
   var north = (lat_rad + deltaY) * 180 / Math.PI
   //console.log('west:'+west+'south:'+south+'east:'+east+'north;'+north)
   var sw = [west,south];
   var se = [east,south];
   var ne = [east,north];
   var nw = [west,north];
   sw = fromLonLat(sw);
   se = fromLonLat(se);
   ne = fromLonLat(ne);
   nw = fromLonLat(nw);
   //console.log('box x:' + sw[0]-se[0] + 'box y:' + ne[1]-se[1]);
   boxcoords = [nw,sw,se,ne,nw];   
   //console.log(boxcoords + 'boxcoords');
   return(boxcoords);
}
var box_spec = get_box_coords(radius*1000,-122.24,37.45);

function getBoxSource(){
   var box_spec = get_box_coords(radius * 1000.0,lon,lat);
   var boxFeature = new Feature({
      geometry: new Polygon([box_spec])
   });
   var boxSource =  new VectorSource({
      features: [boxFeature]      
   });
   return(boxSource)
}

// load the regions checkbox
initMap();

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


$( document ).on("mouseover",".extract",function(){

  //var data = JSON.parse($(this).attr('data-region'));
  show = this.dataset.region;
  //setBoxStyle();
  boxLayer.changed();
});
$( document ).on("mouseout",".extract",function(evt){
  //var data = JSON.parse($(this).attr('data-region'));
  show = '';
  boxLayer.changed();
});


var map = new Map({ target: 'map-container',
  layers: [detail,boxLayer,satLayer,pointerLayer],
  //layers: [satLayer],
  view: new View({
    center: fromLonLat([-122.24,37.45]),
    zoom: 2
  })
}); //end of new Map
window.map = map
var view = map.getView();

map.on("pointermove", function(evt) {
   ptrcoords = toLonLat(evt.coordinate);
   lat = ptrcoords[1];
   lon = ptrcoords[0];
   //satLayer.getSource().clear();
   //update_satbox(evt);
   pointerLayer.setSource(getBoxSource());
   pointerLayer.changed();  
});

$( document ).on('change','#area-choice',function(elem){
   if ( elem.target.value == 'small' )
      radius = 50; 
   else if (elem.target.value == 'medium')
      radius = 150
   else if (elem.target.value == 'large')
      radius = 500;
   satLayer.setSource(getBoxSource());
   satLayer.changed();  
   document.getElementById('cmdline_element').innerHTML = "sudo extend_sat.py --lon " + lon.toFixed(4) + ' --lat ' + lat.toFixed(4) + ' --radius ' + radius;
   console.log("radius changed");
});

map.on("click", function(evt) {
   var coords = toLonLat(evt.coordinate);
   lat = coords[1];
   lon = coords[0];
   satLayer.setSource(getBoxSource());
   satLayer.changed();  
   //console.log("center changed to lon:" + lon.toFixed(2) + '  lat:' + lat.toFixed(2));
   document.getElementById('cmdline_element').innerHTML = "sudo extend_sat.py --lon " + lon.toFixed(4) + ' --lat ' + lat.toFixed(4) + ' --radius ' + radius;

});
var cmdline_element = {};
$( document ).ready(function() {
    console.log( "ready!" );
    document.getElementById('cmdline_element').innerHTML = "sudo extend_sat.py";
    document.getElementById('instr').innerHTML = "First Install at least one of the regions on the left of this window.<br>Then to increase satellite detailed coverage, copy the instructions below, become root, and paste them into a terminal window.";
});

