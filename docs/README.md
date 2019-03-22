## Offline OpenStreetMap + Regional Vector Map Datasets

### Motivation

See ["How do I add zoomable maps for my region?"](http://FAQ.IIAB.IO#How_do_I_add_zoomable_maps_for_my_region.3F) in [FAQ.IIAB.IO](http://FAQ.IIAB.IO)

### Summary Architecture

1. OpenMapTiles.com somewhat regularly publishes OpenStreetMap (OSM) data into [MVT](https://www.mapbox.com/vector-tiles/) Mapbox Vector Tile format, for many dozens of regions around the world.  (This is an [open standard](https://www.mapbox.com/vector-tiles/specification/) which puts all of a region's vector tiles into a single SQLite database, in this case serialized as [PBF](https://wiki.openstreetmap.org/wiki/PBF_Format) and then delivered in a single .mbtiles file.)
1. Internet-in-a-Box (IIAB) works with these highly zoomable regional vector map datasets &mdash; each such .mbtiles file has a very minimal footprint &mdash; yet displays exceptional geographic detail.  IIAB's space-constrained microSD cards (typically running in a Raspberry Pi) greatly benefit!
1. Thankfully the [MBTiles](https://github.com/mapbox/mbtiles-spec) file format can be used to store either bitmap/raster tilesets or vector tilesets.  So 4 essential data files are needed = 1 city search database + 3 .mbtiles files:
   1. cities1000.sqlite (25 MB) so users can search for and locate any of 127,654 cities/settlements worldwide, whose population is larger than 1000.
   1. The world's landmasses are covered by `base.mbtiles -> osm_z0-10_planet.mbtiles` (1.4 GB) at zoom levels 0-10, encoded as MVT/PBF vector maps.
   1. The world's oceans are covered by `ocean.mbtiles -> mymap.mbtiles` (87 MB) at zoom levels 0-10, encoded as PNG bitmap/raster imagery.
   1. **Finally the clincher, that you can customize: `details.mbtiles` adds in zoom levels 1-14 (for one single/chosen region, encoded as MVT/PBF vector maps, which can be overzoomed to level 18+).**
1. An example that includes all 4 = 1 + 3 data files is http://download.iiab.io/content/OSM/vector-tiles/en-osm-omt-min.zip (1.5 GB unzips to 1.8 GB, browsable at http://medbox.iiab.me/modules/en-osm-omt-min/).  [WITH APOLOGIES THAT DEMO SERVER MEDBOX.IIAB.ME IS SOMETIMES OUT OF DATE!]  Specifically: in addition to the above city search and base maps for the world's landmasses and oceans, it also includes 109 MB file `detail.mbtiles -> 2017-07-03_california_san-francisco-bay.mbtiles`.  While this regional vector map dataset is just a small sample (many countries require more than 109 MB) it illustrates the incredible geographic detail of this vector approach, in this case including most building outlines across California's [San Francisco Bay Area](https://openmaptiles.com/downloads/north-america/us/california/san-francisco-bay/).
1. Your Goal Below: replace this small 109 MB sample .mbtiles file, with a different local-or-larger region, for your own regional community.  These regional vector map datasets (plug-in files) can be downloaded from https://openmaptiles.com/downloads/planet/ &mdash; _on the right column of this page, choose a region!_

### How do I add detailed Zoomable Maps for my region?

1. Another prefab example is http://download.iiab.io/content/OSM/vector-tiles/en-osm-omt-central-am.zip (2.8 GB unzips to 3.5 GB, browsable at http://medbox.iiab.me/modules/en-osm-omt-central-am/) which again includes city search and base geodata for the world's landmasses and oceans, but in this case also includes 1.8 GB of zoomable vector map detail for [Central America and the Caribbean](https://openmaptiles.com/downloads/central-america/).  But the goal here is to pull together your own!  So...
1. Start by installing the original 1.5 GB file mentioned as the top of this page, including worldwide base maps etc:
   1. Log in to your IIAB then change to root by running: `sudo su -`
   1. Run: `cd /library/www/html/modules/`
   1. Download it by running:<br>`wget http://download.iiab.io/content/OSM/vector-tiles/en-osm-omt-min.zip`
   1. Run: `unzip en-osm-omt-min.zip` (creates 1.8 GB folder `en-osm-omt-min`)
   1. If you're <i>sure</i> you don't need it, run: `rm en-osm-omt-min.zip` (recovers 1.5 GB)
1. Add your favorite regional vector map dataset:
   1. Run: `cd /library/www/html/modules/en-osm-omt-min/`
   1. Download (into folder `en-osm-omt-min`) your chosen region's vector map dataset from https://openmaptiles.com/downloads/planet/ &mdash; some examples:
      1. 1.14-1.33 GB covers [Central America & the Caribbean](https://openmaptiles.com/downloads/central-america/), a region 5000 km wide including parts of South and North America, with 20 complete countries and portions of 10 other/larger countries
      1. 6.21-6.84 GB covers [South and Central America](https://openmaptiles.com/downloads/dataset/osm/south-america/) including 95% of Mexico
      1. 51.01-57.32 GB covers the [Entire Planet](https://openmaptiles.com/downloads/dataset/osm/)
   1. **Create a symbolic link to replace "details.mbtiles -> 2017-07-03_california_san-francisco-bay.mbtiles" by running: `ln -sf ./<full filename of the downloaded region> details.mbtiles`**
1. Test it:
   1. Connect another device to your IIAB's Wi-Fi (SSID is typically "Internet in a Box")
   1. Browse to http://box/modules/osm-min (occasionally "box" needs to be replaced by "box.lan" or "172.18.96.1")
   1. Zoom into your region of interest to confirm local details appear!
   1. If so, recover 109 MB by running: `rm 2017-07-03_california_san-francisco-bay.mbtiles`
1. Configure http://box/maps so teachers and students get to maps quickly:
   1. Run `nano /etc/apache2/sites-available/osm.conf` to set the appropriate path, modifying this line as required:<br>
   ``Alias /maps /library/www/html/modules/en-osm-omt-min/``
   1. Run: `systemctl restart apache2`
   1. Visit http://box/maps (force a Hard Reload in your browser to get the latest!)
   
### Please redistribute your Fully-assembled Map Pack, to help other schools!

1. Run: `cd /library/www/html/modules/`
1. Rename it appropriately, for example: `mv en-osm-omt-min en-osm-omt-atlantis`
1. Run: `apt install zip` (necessary on Raspbian Lite)
1. Run: `zip -r -y en-osm-omt-atlantis.zip en-osm-omt-atlantis` (e.g. to create `en-osm-omt-atlantis.zip`, the `-y` flag is necessary to prevent traversal of symlinks, in order to avoid duplicate copies of each .mbtiles file)
1. Publish it for all, e.g. using https://archive.org/create.php or https://commons.wikimedia.org/wiki/Special:UploadWizard for smaller files.
1. _[Contact us](http://FAQ.IIAB.IO#What_are_the_best_places_for_community_support.3F) so we can broadly promote your work, in places like [download.iiab.io/content/OSM/vector-tiles/](http://download.iiab.io/content/OSM/vector-tiles/) !_

### Community Design -> Killer Product

Code:
  - [github.com/iiab/maps](https://github.com/iiab/maps) is sometimes a bit out-of-date
  - [download.iiab.io/content/OSM/vector-tiles/en-osm-omt-min.zip](http://download.iiab.io/content/OSM/vector-tiles/en-osm-omt-min.zip) always contains the latest!

Design Decisions:
  - [github.com/iiab/iiab-factory/blob/master/content/vector-tiles/Design-Decisions.md](https://github.com/iiab/iiab-factory/blob/master/content/vector-tiles/Design-Decisions.md)
  - [github.com/georgejhunt/iiab-factory/blob/vector-maps/content/vector-tiles/Design-Decisions.md](https://github.com/georgejhunt/iiab-factory/blob/vector-maps/content/vector-tiles/Design-Decisions.md) just in case!

Usability Engineering begins here &mdash; thanks all who can assist &mdash; improving this for schools worldwide!
  - Package up vector-based OSM maps: [#877](https://github.com/iiab/iiab/issues/877)
  - ~Can OSM Vector Maps fill the entire screen? [#1035](https://github.com/iiab/iiab/issues/1035)~
  - ~How many cities are searchable by new Vector-based OSM? [#1034](https://github.com/iiab/iiab/issues/1034)~
  - ~Teachers want Accents to work when searching for cities in OpenStreetMap [#662](https://github.com/iiab/iiab/issues/662)~ (Can multilingual folk confirm this is really/sufficiently fixed?)
  - Keep OSM from zooming past Level 10, where there's no data? [#1036](https://github.com/iiab/iiab/issues/1036)

_How do we evolve this into a continuously more friendly product?_
