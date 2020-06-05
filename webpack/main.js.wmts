// main.js for base -- regional OSM vector tiles
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import TileImage from 'ol/source/TileImage';
import {fromLonLat,toLonLat} from 'ol/proj';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MVT from 'ol/format/MVT';
import stylefunction from 'ol-mapbox-style/stylefunction';
import {defaults as defaultControls, ScaleLine} from 'ol/control.js';
import GeoJSON from 'ol/format/GeoJSON';
import {Style, Fill, Stroke, Circle, Text} from 'ol/style';
//import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
//import WMTS,{optionsFromCapabilities} from 'ol/source/WMTS.js';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import {get as getProjection} from 'ol/proj.js';
import {getWidth, getTopLeft} from 'ol/extent.js';


import LayerSwitcher from './ol5-layerswitcher.js';


window.$ = window.jQuery = require('jquery');
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
const typeahead = require('./assets/bootstrap-typeahead.min.js');
import Geolocation from 'ol/Geolocation'

var scaleLineControl = new ScaleLine();
// initial values for on event variables to get through startup
var zoom = 3;
var lat = 37;
var lon = -122;
var show = 'min';
var map;
// keep the values set in init.json for home button to use
var config = {};

// Globals for satellite images
var projection = getProjection('EPSG:3857');
var projectionExtent = projection.getExtent();
var size = getWidth(projectionExtent) / 256;
var resolutions = new Array(14);
var matrixIds = new Array(14);
for (var z = 0; z < 14; ++z) {
   // generate resolutions and matrixIds arrays for this WMTS
   resolutions[z] = size / Math.pow(2, z);
   matrixIds[z] = z;
}
   
   const WMTS_layer =  new TileLayer({
           opacity: 1,
           title: 'Satellite',
           //type: 'base',
           enableOpacitySliders: true,
           source: new TileImage({
              format: 'image/jpeg',
              url: './tileserver.php/satellite/{z}/{x}/{y}.jpeg',
              wrapX: true,
              projection: projection,
              tileGrid: new WMTSTileGrid({
                 origin: getTopLeft(projectionExtent),
                 resolutions: resolutions,
                 matrixIds: matrixIds
              })
           })
         });
   
   map = new Map({
     target: 'map-container',
     controls: defaultControls().extend([
       scaleLineControl
     ]),
     view: new View({
       center: fromLonLat([-71.06, 42.37]),
       zoom: 2
     })
   }); //end of new Map

   const detail = new VectorTileLayer({
      source: new VectorTileSource({
         format: new MVT(),
         url: `./tileserver.php/detail/{z}/{x}/{y}.pbf`,
         minZoom: 0,
         maxZoom: 14
      }),
      //type: 'base',
      title: 'OSM',
      enableOpacitySliders: true,
      declutter: true,
   });
   fetch('./assets/style-cdn.json').then(function(response) {
      response.json().then(function(glStyle) {
        stylefunction(detail, glStyle,"openmaptiles");
      });
   });
   map.addLayer(WMTS_layer);
   map.addLayer(detail);

   const boxLayer =  new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: './bboxes.geojson'
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
    var layerSwitcher = new LayerSwitcher({
        tipLabel: 'Légende', // Optional label for button
        layers:map.getLayers()
    });
    map.addControl(layerSwitcher);

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

function update_overlay(){
    var locTxt = "Lat: " + lat.toFixed(3) + " Lon: " + lon.toFixed(3); 
    var tilex = long2tile(lon,zoom);
    var tiley = lat2tile(lat,zoom);
    var zoomInfo = ' Zoom: ' + zoom.toFixed(1);
    locTxt += "   TileX: " + tilex + " TileY: " + tiley + zoomInfo; 
    info_overlay.innerHTML = locTxt;
}

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


// Functions to compute tiles from lat/lon
function long2tile(lon,zoom) {
   return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
}

function lat2tile(lat,zoom)  {
   return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
}

