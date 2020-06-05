# ol-hashed

A simple utility for synchronizing your OpenLayers map state with the URL hash.

## Installation

    npm install ol ol-hashed

The `ol-hashed` module is meant to be used together with (and depends on) the [`ol` package](https://www.npmjs.com/package/ol).

## Usage

The default export from the `ol-hashed` module is a function that you call with a map.

```js
import Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import XYZSource from 'ol/source/xyz';
import sync from 'ol-hashed';

// create a map as you would normally
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

// synchronize the map view with the URL hash
sync(map);
```

You can pass a second options argument to the sync function to control synchronization behavior.

By default, transitions in the map view are animated when browser history changes.  The `animate` option allows you to control this behavior.
```js
// update the view without any animation on history changes
sync(map, {animate: false});
```

By default, animations last 250 ms.  You can provide an object for the `animate` option to control `duration` and `easing` of the animation.
```js
// slower transitions on history changes
sync(map, {animate: {duration: 500}});
```

Calling the `sync` function with a map sets up listeners so that the URL hash is updated when the map view changes and the map view is updated when the URL hash changes (for example, when the user navigates back through history).  The function returns an `unregister` function that can be called to unregister all listeners.
```js
// synchronize the map view with the URL hash
const unregister = sync(map);

// later, if you want the map to no longer by synchronized
unregister();
```
