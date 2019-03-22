#### What Tools, Formats To Use
* Explore OSM as a Data Source (National Geographics looks encumbered)
* Mapbox created MBTiles sqlite format, but then acted proprietary about it -- see https://github.com/osm2vectortiles/osm2vectortiles#osm2vectortiles and an issue thread at https://github.com/osm2vectortiles/osm2vectortiles/issues/387 -- which makes https://github.com/openmaptiles/openmaptiles look more attractive.

#### Sources:
* Subsets of OSM data in .pbf openstreetmap format updated weekly -- http://download.geofabrik.de/index.html
* Regional subsets of OSM data in MVT .mbtiles format -- https://openmaptiles.com/downloads/planet/
* Format for mbtiles -- open spec https://github.com/mapbox/mbtiles-spec
* Ocean depth vectors available at http://www.naturalearthdata.com/downloads/
#### Transforms:
* Docker and tutorials for generating mbtiles from .pbf subsets -- https://github.com/openmaptiles/openmaptiles
* Edit styles with maputnik https://github.com/maputnik/editor/
* Merge shape files with low level tool ogr2ogr -- https://www.northrivergeographic.com/ogr2ogr-merge-shapefiles

#### Servers:
* A php apache server serves mbtiles (multiple) to client -- https://github.com/klokantech/tileserver-php

#### Clients:
* Open source javascript client -- https://openlayers.org/ (tutorial useful at https://openlayers.org/workshop/en/)
* Quandary about typeahead. The current bootstrap works with twitter/typeahead, which in turn requires bloodhound, which adds more complexity than I think is necessary.  But if I use an older typeahead, that worked with bootstrapo versin 2, the maintenance and documentation will become an issue. See https://github.com/twitter/typeahead.js/blob/master/README.md

#### Experiments and Recipe for First Attempt
1. Downloaded small San-Francisco centered mbtiles file (from https://openmaptiles.com/downloads). Initially impressed that the whole Bay area to level 14 occupied only 41MB.
1. Tried a number of mbtile servers (based upon docker, npm, an php). Chose to work with php.
1. Worked through the great workshop examples of using openlayers client javascript tool at https://openlayers.org/workshop/en/. First using online sources for javascript imports, then downloading, and attempting to get first cut to run offline.
1. Developed strategy of creating a world vector set to some intetmediate resolution, and then modifying whatever it took to merge in a regional subset of the world at higher resolution. (The rpi SD real estate is expensive and highly in demand)
1. Downloaded the planet to zoom level 14 (51GB).
1. Created an abstract of the whole planet from zoom level 0 to zoom levels 9 (580MB) and zoom level 10 (1.4GB).
1. Downloaded Central-American bounding box zooms 0-14. Discovered that trying to eliminate zooms 0-10 seemed to confuse the javascript openlayers client.
1. Did not like lower level zoom tiles compared to the colorful National Geographic tiles, which Rachel uses, but which I have not found licensing statement which permits distribution in a "for sale product". 
1. Downloaded raster files from http://www.naturalearthdata.com/downloads/ which shows ocean depth, and landform elevations.
1. Converted the large naturalearth tiff image to mbtiles.
1. Caused the lower zoom level to be backgrounded by naturalearth raster, with overlay from the OSM maptiles.
1. Explored the geosearch used by Rachel, but found its implementation to be closely integrated with leaflet. (Leaflet is an older map client, which many of my sources suggested could not handle vectors easily, except via a  plug in which came late in the product lifecycle).
1. Chose to use the same geosearch search source as used by Rachel, but to use the larger subset of most cities with a population greater than 1000--7MB (rachel searches cities greater than 5000 population - 2MB)-- source: http://download.geonames.org/export/dump/
1. Discovered that the twitter.typeahead lists a requirement of bloodhound, but works for what I need without it. Docs are at http://plugins.upbootstrap.com/bootstrap-ajax-typeahead/