## Offline OpenStreetMap + Regional Vector Map Datasets

### Documentation

- Please see [IIAB Maps](https://github.com/iiab/iiab/wiki/IIAB-Maps) for the latest implementer-focused instructions!
- Also: ["How do I add zoomable maps for my region?"](https://wiki.iiab.io/go/FAQ#How_do_I_add_zoomable_maps_for_my_region.3F) in [FAQ.IIAB.IO](https://wiki.iiab.io/go/FAQ)
- Developers — please see the Jupyter Notebook for version 2020 notes, posted April 2022:
  - https://github.com/iiab/maps/blob/master/osm-source/jupyter-code/maps.ipynb ([original](https://github.com/georgejhunt/maps/blob/maps7.3/osm-source/jupyter-code/maps.ipynb))

### How do I add detailed Zoomable Maps for my region?

Use IIAB's Admin Console, under the "Install Content" heading, to display the checkboxes to select the OpenStreetMap region you want to download.

In a manner similar to downloading/installing Kiwix ZIM files, or RACHEL/OER2Go content modules &mdash; the "Install Selected Region" button then starts a download process, which can take quite some time &mdash; depending upon the size of the region, and the speed of your internet connection.

(The progress of this operation can be monitored by clicking "Utilities" in the header, and then "Display Job Status" in the left column).

### History And Architecture

1. https://OpenMapTiles.com published a 2017-07-03 version of OpenStreetMap (OSM) data and converted it into [MVT](https://www.mapbox.com/vector-tiles/) Mapbox Vector Tile format, for many dozens of regions around the world.  (This is an [open standard](https://www.mapbox.com/vector-tiles/specification/) which puts all of a region's vector tiles into a single SQLite database, in this case serialized as [PBF](https://wiki.openstreetmap.org/wiki/PBF_Format) and then delivered in a single .mbtiles file.)
2. https://s2maps.eu has made free satellite images to zoom level 13 (20M per  pixel) available. These are combined with the OSM data in Internet-in-a-Box (IIAB) maps.  These two sources create highly zoomable regional vector map datasets &mdash; each such .mbtiles file has a very minimal footprint &mdash; yet displays exceptional geographic detail.  IIAB's space-constrained microSD cards (typically running in a Raspberry Pi) greatly benefit!
3. Thankfully the [MBTiles](https://github.com/mapbox/mbtiles-spec) file format can be used to store either bitmap/raster tilesets or vector tilesets.  So 3 essential data files are needed = 1 city search database + 2 .mbtiles files, one each for OSM and Satellite data:
   1. cities1000.sqlite (25-26 MB) so users can search for and locate any of 127,654 cities/settlements worldwide, whose population is larger than 1000.
   2. The world's landmasses are covered by `detail.mbtiles -> <regional selection of OSM data>.mbtiles` (typically 2-30 GB, depending on region) at zoom levels 11-14 and overzoomable to level 18, encoded as MVT/PBF vector maps.
   3. Satellite imagery of the World covered by 'satellite.mbtiles -> satellite_z0-z9_2020.mbtiles` (1.2 GB) at zoom levels 0-9, encoded as JPEG bitmap/raster imagery.  (IIAB also allows you to add to this file, supplementing it with satellite photos for specific regions you care about most.)

Code:
  - [github.com/iiab/maps](https://github.com/iiab/maps) is the source for IIAB maps.

Design Decisions:
  - [github.com/iiab/iiab-factory/blob/master/content/vector-tiles/Design-Decisions.md](https://github.com/iiab/iiab-factory/blob/master/content/vector-tiles/Design-Decisions.md)
  - [github.com/georgejhunt/iiab-factory/blob/vector-maps/content/vector-tiles/Design-Decisions.md](https://github.com/georgejhunt/iiab-factory/blob/vector-maps/content/vector-tiles/Design-Decisions.md) just in case!

Usability Engineering begins here &mdash; thanks all who can assist &mdash; improving this for schools worldwide!
  - ~Teachers want Accents to work when searching for cities in OpenStreetMap [#662](https://github.com/iiab/iiab/issues/662)~ (Can multilingual folk confirm this is really/sufficiently fixed?)

_How do we evolve this into a continuously more friendly product?_
