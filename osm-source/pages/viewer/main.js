// right click branch working towards adding points and data to maps
//////////////////s1 Imports ///////////////////////////////////////////////////
var ContextMenu = require('./ol-contextmenu.js');
//var ol = require('ol');
// temp.js for base -- regional OSM vector tiles
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import XYZSource from 'ol/source/XYZ';
import {fromLonLat,toLonLat,transform} from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import TileImage from 'ol/source/TileImage';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MVT from 'ol/format/MVT';
import stylefunction from 'ol-mapbox-style/dist/stylefunction';
import {defaults as defaultControls, ScaleLine,Attribution} from 'ol/control.js';
import {GPX, GeoJSON, IGC, KML, TopoJSON} from 'ol/format';
import {Style, Fill, Stroke, Circle, Icon, Text} from 'ol/style';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import {format} from 'ol/coordinate';
//import WMTSCapabilities from 'ol/format/WMTSCapabilities.js';
//import WMTS,{optionsFromCapabilities} from 'ol/source/WMTS.js';
//import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import {get as getProjection} from 'ol/proj.js';
import {getWidth, getTopLeft} from 'ol/extent.js';
import LayerSwitcher from './ol5-layerswitcher.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import MapBrowserEvent from 'ol/MapBrowserEvent'
import DragAndDrop from 'ol/interaction/DragAndDrop';
import sync from 'ol-hashed';

//////////////////s2  GLOBALS /////////////////////////////
window.$ = window.jQuery = require('jquery');
const typeahead = require('./assets/bootstrap-typeahead.min.js');
var scaleLineControl = new ScaleLine();
var attribution = new Attribution({
   label: "OpenStreetMaps.org, OpenLayers.com"});

// keep the values set in init.json for home button to use
var config = {};

// Globals for satellite images
var projection = getProjection('EPSG:3857');
var projectionExtent = projection.getExtent();
var size = getWidth(projectionExtent) / 256;
var osm_style = './assets/style-sat.json';

// initial values for on event variables to get through startup
var zoom = 3;
var lat = 37;
var lon = -122;
var show = 'min';
var map;
var osm_style = './assets/style-sat.json';
var tiledata = {};

//////////////////s3 Functions /////////////////////////////////////////////////
function basename(path) {
     return path.replace(/.*\//, '');
}

function dirname(path) {
     return path.match(/.*\//);
}

//////////////////s4 MAPS ///////////////////////////////////////////////////
var map = new Map({ 
  target: 'map-container',
  controls: defaultControls({attribution: false}).extend([
    scaleLineControl,attribution
  ]),
  view: new View({
    center: fromLonLat([-122, 37.35]),
    maxZoom: 19,
    zoom: 11
  })
  //overlays: [overlay]
}); //end of new Map

sync(map);

// Get list of all files in the tiles directory
  var resp = $.ajax({
    type: 'GET',
    url: './mbtileinfo.php',
    async: false,
    dataType: 'text'
  })
  .done(function( data ) {
    var tilenames = JSON.parse(data);
    for(var i = 0;i < tilenames.length;i++){
      console.log('filename:  ' + tilenames[i]['basename']);
      tiledata[basename(tilenames[i]['basename'])] = tilenames[i];
    }
  })

// The Satellite layer needs to go down first with OSM data on top
for(var mbt in tiledata){
   if (mbt.substr(0,3) == 'sat'){
      var sat_layer =  new TileLayer({
        opacity: 1,
        title: 'Satellite',
          //minResolution: 25,
          source: new XYZSource({
           cacheSize: 0,
           // -y in the followinng url changes origin form lower left to upper left
           url: './tileserver.php?./tiles/' + mbt + '/{z}/{x}/{-y}.jpeg',
           wrapX: true
        })
      });
   }
}

var layerDict = {};   
for(var mbt in tiledata){
   if (mbt.substr(0,3) != 'sat'){
      var url = './tileserver.php?./tiles/' +  mbt + '/{z}/{x}/{y}.pbf';
      console.log('URL:' + url);
      const maxzoom = tiledata[mbt]['maxzoom'];
      if (maxzoom <11) {
         layerDict[mbt] = (new VectorTileLayer({
            source: new VectorTileSource({
               cacheSize: 0,
               format: new MVT(),
               url: url
            }),
            //title: 'OSM',
            maxZoom:10, 
            declutter: true
         }));
      } else {
         layerDict[mbt] = (new VectorTileLayer({
            source: new VectorTileSource({
               cacheSize: 0,
               format: new MVT(),
               url: url,
               maxZoom: 14,
            }),
            title: 'OSM',
            declutter: true
         }));
      }
   }
}

function set_detail_style(the_style){
   fetch(the_style).then(function(response) {
      response.json().then(function(glStyle) {
         for(var mbt in layerDict){
           stylefunction(layerDict[mbt], glStyle,"openmaptiles");
         };
      });
   });
}
set_detail_style(osm_style);

///////  Drop new layer onto map  //////////////
const dropSource = new VectorSource();
const drop = new VectorLayer({
  source: dropSource
});

map.addInteraction(new DragAndDrop({
  source: dropSource,
  formatConstructors: [GPX, GeoJSON, IGC, KML, TopoJSON]
}));

/////   add Layers    /////////////////
map.addLayer(sat_layer);
for(var mbt in tiledata){
   if (mbt.substr(0,3) != 'sat'){
         map.addLayer(layerDict[mbt]);
   }
}

const boxLayer =  new VectorLayer({
   source: new VectorSource({
     format: new GeoJSON(),
     url: './assets/bboxes.geojson'
   }),
   style: function(feature) {
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
     for(var mbt in tiledata){
       if (mbt.split(name).length > 1 &&
       ! name.startsWith('sat')) found = true;
     }
     if (found){
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
map.addLayer(drop);

////////s5   MAP EVENTS  ////////////
map.on("moveend", function() {
   var newZoom = map.getView().getZoom();
  if (zoom != newZoom) {
    update_overlay();
    console.log('zoom end, new zoom: ' + newZoom);
    zoom = newZoom;
  }
});

map.on("pointermove", function(evt) {
   var coords = toLonLat(evt.coordinate);
   lat = coords[1];
   lon = coords[0];
   update_overlay();
});

sat_layer.on('change:visible', function(evt) {
   console.log("evt.oldValue:" + evt.oldValue);
   if ( evt.oldValue == false )
      osm_style = './assets/style-sat.json'
   else
      osm_style = './assets/style-osm.json';
   set_detail_style(osm_style);
});

//////////s6    BOTTOM LINE OVERLAY FUNCTIONS  ///////////
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


////////////////s6     below is context menu stuff  ///////////////////////
var contextmenu_no_point = [
   {
     text: 'Add Data Point',
     icon: 'assets/pin_drop.png',
     callback: popUp,
   },
   {
     text: 'Clear Map Points',
     icon: 'assets/pin_drop.png',
     callback: clear,
   },
   {
     text: 'Import Map Points',
     icon: 'assets/pin_drop.png',
     callback: pasteMap,
   },
  {
    text: 'Export Points',
    classname: 'bold',
    icon: 'assets/center.png',
    callback: download,
  },
]

var contextmenu_point = [
  {
    text: 'View Data at Point',
    classname: 'bold',
    icon: 'assets/center.png',
    callback: displayData,
  }
]

var contextmenu = new ContextMenu({
  width: 180,
  items: contextmenu_point,
});
map.addControl(contextmenu);

contextmenu.on('open', function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function(ft, l) {
    return ft;
  });
  if (feature && feature.get('type') === 'removable') {
    contextmenu.clear();
    dropFeature = feature;
    contextmenu.extend(contextmenu_point);
  } else {
    dropFeature = null;
    contextmenu.clear();
    contextmenu.extend(contextmenu_no_point);
  }
});

 function clear(){
   dropSource.clear();
};

map.on('pointermove', function(e) {
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);

  if (e.dragging) return;

  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

////////////////s7     below is popup stuff  ///////////////////////
import 'ol/ol.css';
import Overlay from 'ol/Overlay';
import {toStringHDMS} from 'ol/coordinate';

/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var title = document.getElementById('popup-title');
var thumbnails = document.getElementById('thumbnails');
var content = document.getElementById('popup-textarea');
var closer = document.getElementById('popup-closer');
var done = document.getElementById('popup-done');
var imgAdd = document.getElementById('img-add');
var deleteFeature = document.getElementById('popup-delete');
var importJson = document.getElementById('import-json');

var importJpeg = document.getElementById('import-jpeg');
var seq = document.getElementById('seq');
var pictureElement = document.getElementById('picture');
var bigImg = document.getElementById('bigImg');

var dataPlace;
var dataCoordinate;
var dropFeature = null;

/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});
map.addOverlay(overlay);

function popUp(obj) {
  dataPlace = obj;
  dataCoordinate = obj.coordinate;
  overlay.setPosition(dataCoordinate);
  title.value="";
  content.value="";
  var iconStyle = new Style({
    image: new Icon({ scale: 0.6, src: 'assets/pin_drop.png' }),
    text: new Text({
        offsetY: 25,
        text: title.value,
        font: '15px Open Sans,sans-serif',
        fill: new Fill({ color: 'rgba(67, 163, 46)' }),
        stroke: new Stroke({ color: '#eee', width: 2 }),
      })
    });
  while (thumbnails.hasChildNodes()) {
      thumbnails.removeChild(thumbnails.firstChild);
  }
  // Create a geojson feature to hold everything
  dropFeature = new Feature({
      type: 'removable',
      geometry: new Point(obj.coordinate),
  });
  dropFeature.setStyle(iconStyle);
  drop.getSource().addFeature(dropFeature);
  dropFeature.set('seq','1');  // index into the pictures for this feature
};

function displayData(obj) {
  var feature = dropFeature;
  if ( ! feature) {
      alert('no feature');
      return false;
  };
  if (feature.get('type') === 'removable') {
     title.value = feature.get('title');
     // if there are any images, create the thumbnails
     while (thumbnails.hasChildNodes()) {
         thumbnails.removeChild(thumbnails.firstChild);
     }
     var nextImageNumber = Number(dropFeature.get('seq'));
     for (var i=1; i<nextImageNumber; i++){
         var imageName = 'img-'+i;
         var url = dropFeature.get(imageName);
         if ( url === '') continue;
         var elem = document.createElement('DIV');
         elem.id = imageName;
         elem.className = ' thumb';
         var img = document.createElement('IMG');
         img.onclick = large;
         img.src = url;
         img.alt = '';
         img.setAttribute('data-name', imageName);
         elem.appendChild(img);
         thumbnails.appendChild(elem);
         
     }
     content.value = feature.get('content');
     var coordinate = feature.getGeometry().getCoordinates();
     overlay.setPosition(coordinate);
  };
};
/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

///////////////////s8  Fuctions used by Point Overlay  //////////////////////////
deleteFeature.onclick = function() {
  if (dropFeature)
      drop.getSource().removeFeature(dropFeature);
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

done.onclick = function(){
  console.log('done.onclik');
  if ( dropFeature !== null ) {
     console.log('feature is not null');
     dropFeature.set('title',title.value);
     dropFeature.set('content',content.value);
     var iconText = dropFeature.getStyle().getText();
     iconText.setText(title.value);
  } else {
      alert('feature is null. . .Quitting');
  }
  overlay.setPosition(undefined);
  closer.blur();
  bigImg.src = '';
  picture.style = 'display:none';
  return false;
};

function large(elem){
   console.log("function large");
   var imgName = elem.toElement.dataset.name;
   bigImg.src  = dropFeature.get(imgName);
  picture.style = 'display:block';
}
   
map.on('singleclick',function(){
   // hide the large image which displays via click on thumbnail
   bigImg.src = '';
   picture.style = 'display:none';
});

/////////////////////s9  Import and Export points  //////////////////////////////
function download(){
   const format = new GeoJSON({featureProjection: 'EPSG:3857'});
   const features = dropSource.getFeatures();
   const json = format.writeFeatures(features);
   var link=document.createElement('a');
   link.href = 'data:text/json;charset=utf-8,' + json;
   link.download = 'features.json';
   link.click();
};

function pasteMap(){
   // click on a hidden input File element, which in turn fetches the points
   importJson.click();
};
importJson.addEventListener('change',importFeatures); // fired by file chooser

imgAdd.onclick = function(){
   // import image uses a hidden input tag to open a local client file chooser
   importJpeg.click();
}
importJpeg.addEventListener('change',importImage);

// need a Global for import Features
var dataURL;
function importFeatures(evt){
   const fr = new FileReader();
   //console.log(importJson.files[0]);
   fr.onload = function(){
      dataURL = fr.result;
      addPoints(dataURL);
      //console.log(dataURL);
    };
   //var url = URL.createObjectURL(evt);
   var feature_json = fr.readAsDataURL(importJson.files[0]);
}

function addPoints(data){
   var json = atob(data.split(',')[1]);
   console.log('addPoints');
   var points = JSON.parse(json);
   console.log('json object:' + points);
   for (var i=0; i<points['features'].length; i++){
      var feat = points['features'][i];
      var coord4326 = transform(feat.geometry.coordinates, 'EPSG:4326', 'EPSG:3857'),
      iconStyle = new Style({
         image: new Icon({ scale: 0.6, src: 'assets/pin_drop.png' }),
         text: new Text({
            offsetY: 25,
            text: feat.properties.title,
            font: '15px Open Sans,sans-serif',
            fill: new Fill({ color: '#111' }),
            stroke: new Stroke({ color: '#eee', width: 2 })
         })
      }),
      feature = new Feature({
         title: feat.properties.title,
         content: feat.properties.content,
         type: 'removable',
         seq: feat.properties.seq,
         
         geometry: new Point(coord4326),
      });
      for (var j=1; j<Number(feat.properties.seq); j++){
         var imageName = 'img-'+j;
         if (feat.properties.imageName == '') continue;
         var URL = feat.properties[imageName];
         feature.set(imageName,feat.properties[imageName]);
      }
     feature.setStyle(iconStyle);
     drop.getSource().addFeature(feature);
     console.log(feat.properties.title + coord4326);
   }
}

var imgURL;
// need a Global for import Image function
var bigimg;
function importImage(evt){
   const fr = new FileReader();
   //console.log(importJpeg.files[0]);
   fr.onload = function(){
      imgURL = fr.result;
      var jpeg = atob(imgURL.split(',')[1]);
      //console.log(jpeg);
      bigImg.src = imgURL;
      var seq = dropFeature.get('seq');
      var num = Number(seq) + 1;
      dropFeature.set('seq', num.toString());
      var imgName = 'img-' + seq;
      dropFeature.set(imgName,imgURL); // stores as base64 with "data:image" prefix
      displayData();
    };
   var imageData = fr.readAsDataURL(importJpeg.files[0]);
}

