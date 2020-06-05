import Map from 'ol/map';
import TileLayer from 'ol/layer/tile';
import View from 'ol/view';
import XYZSource from 'ol/source/xyz';
import sync from '..';

const map = new Map({
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new XYZSource({
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
      })
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

sync(map, {animate: false});
