import Map from 'ol/map';
import TileLayer from 'ol/layer/tile';
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
  ]
});

sync(map);
