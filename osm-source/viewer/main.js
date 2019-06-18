// main.js for viewer -- regional OSM vector tiles -- param is region
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import XYZSource from 'ol/source/XYZ';
import {fromLonLat,toLonLat} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import TileImage from 'ol/source/TileImage';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MVT from 'ol/format/MVT';
import stylefunction from 'ol-mapbox-style/stylefunction';
import {defaults as defaultControls, ScaleLine,Attribution} from 'ol/control.js';
import GeoJSON from 'ol/format/GeoJSON';
import {Style, Fill, Stroke, Circle, Text} from 'ol/style';
//import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
//import WMTS,{optionsFromCapabilities} from 'ol/source/WMTS.js';
//import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import {get as getProjection} from 'ol/proj.js';
import {getWidth, getTopLeft} from 'ol/extent.js';
import LayerSwitcher from './ol5-layerswitcher.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import MapBrowserEvent from 'ol/MapBrowserEvent'

/////////////  GLOBALS /////////////////////////////
window.$ = window.jQuery = require('jquery');
const typeahead = require('./assets/bootstrap-typeahead.min.js');
var scaleLineControl = new ScaleLine();
var attribution = new Attribution({
   label: "OpenStreetMaps.org, OpenLayers.com"});

// initial values for on event variables to get through startup
var zoom = 3;
var lat = 37;
var lon = -122;
var show = 'min';
var map;
var osm_style = './assets/style-sat.json';
window.mapCatalog = {};
window.layers = [];

// keep the values set in init.json for home button to use
var config = [];
var region;

// Globals for satellite images
var projection = getProjection('EPSG:3857');
var projectionExtent = projection.getExtent();
var sat_layer;
   
// One thought was that a parameter would direct the viewer to target.
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
var path = getUrlParameter('path');
if (path =='') path = 'maplist'; else {
   var ret = /omt_([a-z_]*)_\d{4}/.exec(path);
   region = ret[1];
   console.log('region:' + region);
}
var path = '../' + path + '/';

map = new Map({ 
   target: 'map-container',
      controls: defaultControls({attribution: false}).extend([
      scaleLineControl,attribution
   ]),
   view: new View({
     center: fromLonLat([-71.06, 42.37]),
     zoom: 2
   })
}) //end of new Map
var view = map.getView();

$.when(read_mbtiles()).then( function(){
   //console.log('url:' + mapCatalog[region].url);
   //var basename = mapCatalog[region].url.replace(/.*\//, '');
   // Clip off .zip
   //basename = basename.replace(/\.zip/, '');
   // console.log('basename:' + basename); 
   var detail;
   for (var i=0; i < layers.length;i++){
      if ( layers[i].format === "image/pbf" ){
         detail = new VectorTileLayer({
            source: new VectorTileSource({
               format: new MVT(),
               //url: './tileserver_iiab.php/' + basename + '/' + basename + '/{z}/{x}/{y}.pbf',
               url: './tileserver.php/' + layers[i].fname + '/{z}/{x}/{y}.pbf',
               minZoom: 0,
               maxZoom: 14
            }),
            //type: 'base',
            title: 'OSM',
            //enableOpacitySliders: true,
            declutter: true,
         })
         layers[i]['object'] = detail;
         set_style(detail,osm_style);
         map.addLayer(detail);
      } else if ( layers[i].format === "image/jpeg" ){
        sat_layer =  new TileLayer({
        opacity: 1,
        title: 'Satellite',
        minResolution: 16,
        //enableOpacitySliders: true,
        source: new XYZSource({
           // -y in the followinng url changes origin form lower left to upper left
           url: './tileserver.php/' + layers[i].fname +'/{z}/{x}/{-y}.jpeg',
           wrapX: true
        })
      })
      layers[i]['object'] = sat_layer;
      map.addLayer(sat_layer);
      sat_layer.on('change:visible', function(evt) {
         console.log("evt.oldValue:" + evt.oldValue);
         if ( evt.oldValue == false )
            osm_style = './assets/style-sat.json'
         else
            osm_style = './assets/style-osm.json';
         set_style(sat_layer,osm_style);
      });

      } // format decision
    } // for loop
  })


function set_style(the_layer,the_style){
   fetch(the_style).then(function(response) {
      response.json().then(function(glStyle) {
        stylefunction(the_layer, glStyle,"openmaptiles");
      });
   });
}

const boxLayer =  new VectorLayer({
   source: new VectorSource({
     format: new GeoJSON(),
     url: './assets/bboxes.geojson'
   }),
   style: function(feature) {
     var name = feature.get("name");
     if (typeof show !== 'undefined' &&
          show != null && name == show) {
       return new Style({
         fill: new Fill({
           color: 'rgba(67, 163, 46, 0)'
         }),
         stroke: new Stroke({
           color: 'rgba(67, 163, 46, 1)',
           width: 2
         })
       })
     } else {
       return new Style({
         fill: new Fill({
           color: 'rgba(255,255,255,0)'
         }),
         stroke: new Stroke({
           color: 'rgba(255,255,255,0)'
         })
       })
     } 
   } 
})
map.addLayer(boxLayer);    

////////   MAP EVENTS  ////////////
map.on("moveend", function() {
   zoom = map.getView().getZoom(); 
   update_overlay();
});

map.on("pointermove", function(evt) {
   var coords = toLonLat(evt.coordinate);
   lat = coords[1];
   lon = coords[0];
   update_overlay();
});


//////////    BOTTOM LINE OVERLAY FUNCTIONS  ///////////
// Configuration of home key in init.json
var resp = $.ajax({
   type: 'GET',
   async: true,
   url: './init.json',
   dataType: 'json'
})
.done(function( data ) {
   config = data;
   var coord = [parseFloat(config.center_lon),parseFloat(config.center_lat)];
   console.log(coord + "");
   var there = fromLonLat(coord);
   map.getView().setCenter(there);
   map.getView().setZoom(parseFloat(config["zoom"]));
   show = config.region;
   $( '#home' ).on('click', function(){
      console.log('init.json contents:' + config.center_lat);
          var there = fromLonLat([parseFloat(config.center_lon),parseFloat(config.center_lat)]);
          map.getView().setCenter(there);
          map.getView().setZoom(parseFloat(config.zoom));
          console.log('going there:' +there + 'zoom: ' + parseFloat(config.zoom));
   });
});

// Functions to compute tiles from lat/lon for bottom line
function long2tile(lon,zoom) {
   return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
}

function lat2tile(lat,zoom)  {
   return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
}

function update_overlay(){
    var locTxt = "Lat: " + lat.toFixed(2) + " Lon: " + lon.toFixed(2); 
    var tilex = long2tile(lon,zoom);
    var tiley = lat2tile(lat,zoom);
    var zoomInfo = ' Zoom: ' + zoom.toFixed(1);
    //locTxt += "   TileX: " + tilex + " TileY: " + tiley + zoomInfo; 
    locTxt += zoomInfo; 
    info_overlay.innerHTML = locTxt;
}

/////////  ADD FUNCTIONS  ///////////////
var layerSwitcher = new LayerSwitcher({
  tipLabel: 'Légende', // Optional label for button
  layers:map.getLayers()
});
map.addControl(layerSwitcher);

/////////    SEARCH FUNCTION ///////////
var info_overlay = 1;
$( document ).ready(function() {
   // typeahead has (window.jQuery) at the end of its definition
   window.$ = window.jQuery = jQuery;  // needs definition globally
   var unitsSelect = document.getElementById('units');
   function onChange() {
     scaleLineControl.setUnits(unitsSelect.value);
   }
   info_overlay = document.getElementById('info-overlay');
   unitsSelect.addEventListener('change', onChange);
   onChange();
});

   var selections = Array(50);
   function go_there(item){
       for (var i=0;i<selections.length;i++){
          if (selections[i].geonameid == item.value){
             var there = fromLonLat([selections[i].lon,selections[i].lat]);
             map.getView().setCenter(there);
             map.getView().setZoom(10);
             console.log(selections[i].lon + ' ' + selections[i].lat);
          }
       }
       $('#search').val('');
    }

$(function() {
  $('#search').typeahead({
      onSelect: function(item) {
        console.log(item);
        go_there(item);
      },
      ajax: {
         url: './searchapi.php?searchfor='+$('#search').val(),
         method: 'get',
         triggerLength: 1,
         displayField: 'name',
         valueField: "geonameid",
         dataType: "json",
         preProcess: function (data) {
          if (data.success === false) {
            // Hide the list, there was some error
            return false;
          }
          // We good!
          selections = [];
          for (var i=0;i<data.length;i++) {
            data[i].name = data[i].name + ' ' + data[i].country_code + ' pop: ' + data[i].population;
            var choice = {geonameid:data[i].geonameid,lon:data[i].longitude,lat:data[i].latitude};
            selections.push(choice);
          } 
          return data;
          }
      }, // ajax get cities with his prefix
   }); // typeahead onSelect
}); // end of search selection


