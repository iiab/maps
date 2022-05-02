## Offline OpenStreetMap Vector Map Continents/Regions + Satellite Photos

### Documentation

- Getting Started — ["How do I add zoomable maps for my region?"](https://wiki.iiab.io/go/FAQ#How_do_I_add_zoomable_maps_for_my_region%3F) in [FAQ.IIAB.IO](https://wiki.iiab.io/go/FAQ)
- Implementers — [IIAB Maps](https://github.com/iiab/iiab/wiki/IIAB-Maps) (wiki) has the latest implementer-focused instructions and explanations!
- Developers — Check out the [Jupyter Notebook](https://github.com/iiab/maps/blob/master/osm-source/jupyter-code/maps.ipynb) version 2020 notes ([original](https://github.com/georgejhunt/maps/blob/maps7.3/osm-source/jupyter-code/maps.ipynb)) posted April 2022, and its predecessor ["Recipe for Generating Map Regions"](https://github.com/iiab/maps/wiki) posted earlier in January 2021.

### How do I add detailed Zoomable Maps for my region?

1. Use IIAB's [Admin Console](https://wiki.iiab.io/go/FAQ#What_are_the_default_passwords?) (http://box.lan/admin) > `Install Content` > `Get Map Regions` to select the [OpenStreetMap continent-or-region](https://github.com/iiab/iiab/issues/3111#issuecomment-1101975788) you want (choosing among the dozen checkboxes).

   In a manner similar to downloading/installing Kiwix ZIM files, or RACHEL/OER2Go content modules &mdash; the `Install Selected Region` button then starts a download process, which can take quite some time &mdash; depending upon the size of the region, and your internet/download speed.

   (Progress can be monitored by clicking `Utilities` in the header, and then `Display Job Status` in the left column.)

2. Or if you prefer the [command-line](https://github.com/iiab/maps/blob/master/osm-source/pages/viewer/scripts/iiab-install-map-region), run:

   `sudo iiab-install-map-region <CONTINENT-or-REGION>.mbtiles`

   (Specifying any of a dozen OpenStreetMap [continent-or-region .mbtiles files](https://github.com/iiab/iiab/wiki/IIAB-Maps#where-are-iiab-maps-stored) from our catalog.)

### History and Architecture

1. MapTiler (https://OpenMapTiles.com and https://OpenMapTiles.org) published a 2017-07-03 version of OpenStreetMap (OSM) data and converted it into [MVT](https://www.mapbox.com/vector-tiles/) Mapbox Vector Tile format, for many dozens of regions around the world.  (This is an [open standard](https://www.mapbox.com/vector-tiles/specification/) which puts all of a region's vector tiles into a single SQLite database, in this case serialized as [PBF](https://wiki.openstreetmap.org/wiki/PBF_Format) and then delivered in a single .mbtiles file.)
2. Sentinel (https://s2maps.eu) has made available free satellite images to [zoom level 13](https://wiki.openstreetmap.org/wiki/Zoom_levels) (19 x 19 m pixels).  These are combined with the OSM data in Internet-in-a-Box (IIAB) maps.  These two sources create highly zoomable regional vector map datasets &mdash; each such .mbtiles file has a very minimal footprint &mdash; yet displays exceptional geographic detail.  IIAB's space-constrained microSD cards (typically running in a Raspberry Pi) greatly benefit!
   1. Install [satellite photo square regions (100x100 km, 300x300 km, or 1000x1000 km)](https://github.com/iiab/iiab/wiki/IIAB-Maps) using IIAB's Admin Console > `Install Content` > `Get Map Regions` &mdash; or use the original approach of [pasting a lat/long bounding box into the command-line](https://github.com/iiab/iiab/wiki/IIAB-Maps#how-do-i-install-map-packs-and-satellite-photo-regions-on-iiab-80-).
4. Thankfully the [MBTiles](https://github.com/mapbox/mbtiles-spec) file format can be used to store either bitmap/raster tilesets or vector tilesets.  So 3 essential data files are needed = 1 city search database + 2 .mbtiles files, one each for OSM and Satellite data:
   1. cities1000.sqlite (25-26 MB) so users can search for and locate any of 127,654 cities/settlements worldwide, whose population is larger than 1000.
   2. The world's landmasses are covered by `detail.mbtiles -> <regional selection of OSM data>.mbtiles` (typically 2-30 GB, depending on region) at zoom levels 11-14 and overzoomable to level 18 — encoded as MVT/PBF vector maps.
   3. Satellite imagery of the World is covered by `satellite.mbtiles -> satellite_z0-z9_2020.mbtiles` (1.2 GB) at zoom levels 0-9, encoded as JPEG bitmap/raster imagery.  (IIAB also allows you to add to this file, supplementing it with satellite photos for specific regions you care about most.)

#### Source Code in 4 Repos

  - [github.com/iiab/maps](https://github.com/iiab/maps) (right here!)
  - [github.com/iiab/maptools](https://github.com/iiab/maptools) > [README](https://github.com/iiab/maptools#readme)
  - [IIAB's roles/osm-vector-maps](https://github.com/iiab/iiab/tree/master/roles/osm-vector-maps) > [README ("What's New with IIAB Maps?")](https://github.com/iiab/iiab/tree/master/roles/osm-vector-maps#readme)
  - [github.com/iiab/iiab-admin-console](https://github.com/iiab/iiab-admin-console/search?q=osm)
    - [github.com/iiab/iiab-factory](https://github.com/iiab/iiab-factory/search?q=osm) (historical, see below)

#### 2018 Design Decisions

  - [github.com/iiab/iiab-factory/blob/master/content/vector-tiles/Design-Decisions.md](https://github.com/iiab/iiab-factory/blob/master/content/vector-tiles/Design-Decisions.md) ([original](https://github.com/georgejhunt/iiab-factory/blob/vector-maps/content/vector-tiles/Design-Decisions.md))

### Future

Usability Engineering begins here &mdash; thanks all who can assist &mdash; improving this for schools worldwide!
  - ~Teachers want Accents to work when searching for cities in OpenStreetMap [#662](https://github.com/iiab/iiab/issues/662)~ (Can multilingual folk confirm this is really/sufficiently fixed?)
  - 2022 progress status/summary: [#3077](https://github.com/iiab/iiab/issues/3077)

_How do we evolve this into a continuously more friendly [Internet-in-a-Box](https://internet-in-a-box.org/) product?_
