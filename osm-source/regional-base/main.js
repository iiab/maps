import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import stylefunction from 'ol-mapbox-style/stylefunction';
import MVT from 'ol/format/MVT';
import {fromLonLat,toLonLat} from 'ol/proj';
var map;
   map = new Map({
     target: 'map-container',
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
      declutter: true,
   });
   fetch('./assets/style-osm.json').then(function(response) {
      response.json().then(function(glStyle) {
        stylefunction(detail, glStyle,"openmaptiles");
      });
   });
   map.addLayer(detail);
