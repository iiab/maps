## Offline OpenStreetMap + Regional Vector Map Datasets

### How do I add detailed Zoomable Maps for my region?

. Use Administrative Console, under the 'Install Content' heading, to display the checkboxes for selection of the MAP region for download. In a manner similar to installing Kiwix, or Rachel content modules, the "Install Selected Region" button starts a download process, which will complete in more or less time, based  upon the size of the region, and the speed of your internet connection. The progress of this operation can be monitored by clicking "utilities" in the header, an "Display Job Status" in the left column.

### Cross Reference

See ["How do I add zoomable maps for my region?"](http://FAQ.IIAB.IO#How_do_I_add_zoomable_maps_for_my_region.3F) in [FAQ.IIAB.IO](http://FAQ.IIAB.IO)

### History And Architecture

1. OpenMapTiles.com has published a 2017-07-03 version of OpenStreetMap (OSM) data and converted it into [MVT](https://www.mapbox.com/vector-tiles/) Mapbox Vector Tile format, for many dozens of regions around the world.  (This is an [open standard](https://www.mapbox.com/vector-tiles/specification/) which puts all of a region's vector tiles into a single SQLite database, in this case serialized as [PBF](https://wiki.openstreetmap.org/wiki/PBF_Format) and then delivered in a single .mbtiles file.)
1. https://s2maps.eu/ has made free satellite images to zoom level 13 (20M per  pixel) available. These are combined with the OSM data in Internet-in-a-Box (IIAB) maps. These two sources create highly zoomable regional vector map datasets &mdash; each such .mbtiles file has a very minimal footprint &mdash; yet displays exceptional geographic detail.  IIAB's space-constrained microSD cards (typically running in a Raspberry Pi) greatly benefit!
1. Thankfully the [MBTiles](https://github.com/mapbox/mbtiles-spec) file format can be used to store either bitmap/raster tilesets or vector tilesets.  So 3 essential data files are needed = 1 city search database + 2 .mbtiles files, one each for OSM and Satellite data:
   1. cities1000.sqlite (25 MB) so users can search for and locate any of 127,654 cities/settlements worldwide, whose population is larger than 1000.
   1. The world's landmasses are covered by `detail.mbtiles -> <regional selection of OSM data>.mbtiles` (2-10GB depending on region) at zoom levels 0-18, encoded as MVT/PBF vector maps.
   1. Satellite imagery of the World  covered 'satellite.mbtiles -> satellite_z0-z9.v3.mbtiles` (932 MB) at zoom levels 0-9, encoded as JPEG bitmap/raster imagery.
 

Code:
  - [github.com/iiab/maps](https://github.com/iiab/maps) is sometimes a bit out-of-date
  - [download.iiab.io/content/OSM/vector-tiles/en-osm-omt-min.zip](http://download.iiab.io/content/OSM/vector-tiles/en-osm-omt-min.zip) always contains the latest!

Design Decisions:
  - [github.com/iiab/iiab-factory/blob/master/content/vector-tiles/Design-Decisions.md](https://github.com/iiab/iiab-factory/blob/master/content/vector-tiles/Design-Decisions.md)
  - [github.com/georgejhunt/iiab-factory/blob/vector-maps/content/vector-tiles/Design-Decisions.md](https://github.com/georgejhunt/iiab-factory/blob/vector-maps/content/vector-tiles/Design-Decisions.md) just in case!

Usability Engineering begins here &mdash; thanks all who can assist &mdash; improving this for schools worldwide!
  - ~Teachers want Accents to work when searching for cities in OpenStreetMap [#662](https://github.com/iiab/iiab/issues/662)~ (Can multilingual folk confirm this is really/sufficiently fixed?)

_How do we evolve this into a continuously more friendly product?_
