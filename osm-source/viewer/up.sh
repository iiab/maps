#!/bin/bash
rsync data/sparql/templates/* /library/www/osm-vector-maps/viewer/data/sparql/templates/

mkdir -p /library/www/osm-vector-maps/viewer/catalog
rsync catalog/wikidata.json /library/www/osm-vector-maps/viewer/catalog/

rm -f /library/www/osm-vector-maps/viewer/data/geojson/*

rsync scripts/sparql-to-geojson-final.py /library/www/osm-vector-maps/viewer/

rsync -r assets/* /library/www/osm-vector-maps/viewer/assets/

rsync -r build/* /library/www/osm-vector-maps/viewer/

rsync jsonserver.php /library/www/osm-vector-maps/viewer/

rsync markers/* /library/www/osm-vector-maps/viewer/markers/

rsync -r data/ /library/www/osm-vector-maps/viewer/data
