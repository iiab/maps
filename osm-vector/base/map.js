import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
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
window.$ = window.jQuery = require('jquery');
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap-typeahead';

var scaleLineControl = new ScaleLine();
var mapData = "/common/assets";
var show = 'central_america';

const map = new Map({
  target: 'map-container',
  controls: defaultControls().extend([
    scaleLineControl
  ]),
  layers: [
    new TileLayer({
      source: new XYZSource({
        url: './tileserver.php/ocean/{z}/{x}/{y}.png'
      })
    })
  ],
  view: new View({
    center: fromLonLat([-71.06, 42.37]),
    zoom: 2
  })
});

const detail = new VectorTileLayer({
   source: new VectorTileSource({
      format: new MVT(),
      url: `./tileserver.php/detail/{z}/{x}/{y}.pbf`,
      minZoom: 0,
      maxZoom: 14
   }),
   declutter: true,
});
fetch('./assets/style-cdn.json').then(function(response) {
   response.json().then(function(glStyle) {
     stylefunction(detail, glStyle,"openmaptiles");
   });
});
map.addLayer(detail);

const boxLayer =  new VectorLayer({
   source: new VectorSource({
     format: new GeoJSON(),
     url: mapData + '/bboxes.geojson'
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

var unitsSelect = document.getElementById('units');
function onChange() {
  scaleLineControl.setUnits(unitsSelect.value);
}
unitsSelect.addEventListener('change', onChange);
onChange();

var info_overlay = 0;
$( document ).ready(function() {
   // typeahead has (window.jQuery) at the end of its definition
   window.$ = window.jQuery = jQuery;  // needs definition globally

   info_overlay = document.getElementById('info-overlay');
   map.on("pointermove", function(evt) {
       //var zoom = map.getZoom(); 
       var coords = toLonLat(evt.coordinate);
       var lat = coords[1];
       var lon = coords[0];
       var locTxt = "Lat: " + lat.toFixed(3) + " Lon: " + lon.toFixed(3); 
       var tilex = long2tile(lon,zoom);
       var tiley = lat2tile(lat,zoom);
       var zoomInfo = ' Zoom: ' + zoom.toFixed(1);
       locTxt += "<br>TileX: " + tilex + " TileY: " + tiley + zoomInfo; 
       info_overlay.innerHTML = locTxt;
   });

   var selections = Array(50);
   function go_there(item){
       for (var i=0;i<selections.length;i++){
          if (selections[i].geonameid == item.value){
             var there = fromLonLat([selections[i].lon,selections[i].lat]);
             map.getView().setCenter(there);
             map.getView().setZoom(9);
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


   var toggleButton = document.getElementById('toggle');
   document.addEventListener('click', toggle);
   var button_state = 0;
   function toggle() {
      if (button_state != 0) {
         info_overlay.style.visibility = "hidden";
         button_state = 0;
       } else {
         info_overlay.style.visibility = "visible";
         button_state = 1;
       };
   };  
        
   var zoom = 2;
      map.on("moveend", function() {
            zoom = map.getView().getZoom(); 
      });
   // Functions to compute tiles from lat/lon
   function long2tile(lon,zoom) {
      return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
   }
   function lat2tile(lat,zoom)  {
      return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
   }
   var config = {};
   var resp = $.ajax({
      type: 'GET',
      async: true,
      url: './init.json',
      dataType: 'json'
   })
   .done(function( data ) {
      config = data;
      var coord = [parseFloat(config.lon),parseFloat(config.lat)];
      console.log(coord + "");
      var there = fromLonLat(coord);
      map.getView().setCenter(there);
      map.getView().setZoom(parseFloat(config["zoom"]));
      show = config.region;
   });
}); // end of document ready
