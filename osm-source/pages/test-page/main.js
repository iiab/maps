// main.js for IIAB test page showing regions available
import {Fill, Stroke, Style} from 'ol/style';
import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
//import XYZSource from 'ol/source/XYZ';
//import MVT from 'ol/format/MVT';
import $ from 'jquery';
document.$ = document.jQuery = $;
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

// a global variable to control which features are shown
var show = {};
var mapData = "/osm-vector-maps/maplist/assets";
var mapList = [];
var consoleJsonDir = '/common/assets/';
var mapCatalog = {};

var map = new Map({
  target: 'map-container',
  layers: [
    new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: mapData + '/countries.json'
      }),
      style: new Style({
        fill: new Fill({
          color: 'rgb(219, 180, 131)' 
        }),
        stroke: new Stroke({
          color: 'white'
        })
      })
    }),
    
  ],

  view: new View({
    center: [0, 0],
    zoom: 2
  })
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

var boxLayer = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: mapData + '/bboxes.geojson'
  }),
  id: 'boxes',
  style: setBoxStyle
});
map.addLayer(boxLayer);

$( document ).on("mouseover",".extract",function(){

  show = this.dataset.region;
  //setBoxStyle();
  boxLayer.changed();
});
$( document ).on("mouseout",".extract",function(){
  show = '';
  boxLayer.changed();
});

function readableSize(kbytes) {
  if (kbytes == 0)
  return "0";
  var bytes = 1024 * kbytes;
  var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
  var e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, e)).toFixed(2) + " " + s[e];
}

function readMapCatalog(){
   //console.log ("in readMapCalalog");
   // read map-catalog.json from common/assets in case osm vectors not installed
  mapList = [];
  var resp = $.ajax({
    type: 'GET',
    url: consoleJsonDir + 'map-catalog.json',
    async: false,
    dataType: 'json'
  })
  .done(function( data ) {
    var mapJson = data;
    mapCatalog = mapJson['maps'];
    for(var key in mapCatalog){
      //console.log(key + '  ' + mapCatalog[key]['title']);
      mapCatalog[key]['name'] = key;
      mapList.push(mapCatalog[key]);
    }
  })
  .fail(function( data ) {
      console.log('failed to reatMaapCatalog');
  })
  return resp;
}

function renderMapList(checkbox) { // generic
   var html = "";
   // order the mapList by seq number
   var regions = mapList;
   console.log ("in renderMapList");

   // sort on basis of seq
  regions = regions.sort(function(a,b){
    if (a.seq < b.seq) return -1;
    else return 1;
    });
  //console.log(regions);
   // render each region
   html += '<form>';
   regions.forEach((region, index) => { // now render the html
      //console.log(region.title + " " +region.seq);
      html += genMapItem(region,checkbox);
  });
  html += '</form>';
  //console.log(html);
  $( "#mapList" ).html(html);
  activateTooltip();
}

function map_is_installed(mapname){
  for (var key in map_idx)
    if (key && map_idx[key].file_name == basename(mapname)) return true
  return false;
}

function genMapItem(region,checkbox) {
  var html = "";
  var colorClass = "";
  console.log("in genMapItem: " + region.name);
  var itemId = region.title;
  var ksize = region.size / 1000;
  // is this region already insalled?
  //if (map_is_installed(region.detail_url)) colorClass = 'installed';
  html += '<div class="extract" data-region="' + region.region + '" ';
  html += ' data-mapid="' + basename(region.detail_url) + '" ';
      html += ' onChange="updateCmdline(this)" >';
  html += '<label>';
  html += '</label>'; // end input
  var mapToolTip = genMapTooltip(region);
  html += '<span class="map-desc ' + colorClass + '"' + mapToolTip + '>&nbsp;&nbsp;' + itemId + '</span>';
  html += ' ' + readableSize(ksize);
  html += '</div>';
  //console.log(html);

  return html;
}

function genMapTooltip(map) {
  var mapToolTip = ' data-toggle="tooltip" data-placement="top" data-html="true" ';
  var re = /^.*_(v[0-9]+\.[0-9]+)\.zip/;
  var url = map.url;
  //var installed = getInstalledVersion(map.perma_ref);
  var installed = '';
  if ( installed == '' ) installed = 'Not installed';
  var version = url.replace(re,'$1');
  mapToolTip += 'title="';
  mapToolTip += 'Date: ' + map.date + "  Version: " + version + '<br>';
  mapToolTip += 'Available: ' + basename(map.detail_url)+'"' ;
  //mapToolTip += 'Installed: '+ installed + '"';
  //mapToolTip += 'title="<em><b>' + zim.description + '</b><BR>some more text that is rather long"';
  //console.log(mapToolTip);
  return mapToolTip;
}

function basename(path) {
     return path.replace(/.*\//, '');
}

function activateTooltip() {
    $('[data-toggle="tooltip"]').tooltip({
      animation: true,
      delay: {show: 500, hide: 100}
    });
}

function getMapStat(){
  // called during the init
  console.log('in getMapStat');
  readMapCatalog();
  //readMapIdx();
}
$.when(getMapStat()).then(function(){renderMapList(true);});
