#!/bin/bash
rsync data/sparql/templates/* /library/www/osm-vector-maps/viewer/data/sparql/template/

rm /library/www/osm-vector-maps/viewer/data/geojson/*

rsync -r assets/* /library/www/osm-vector-maps/viewer/assets/

rsync -r build/* /library/www/osm-vector-maps/viewer/

rsync jsonserver.php /library/www/osm-vector-maps/viewer/

rsync markers/* /library/www/osm-vector-maps/viewer/markers/

rsync -r data/ /library/www/osm-vector-maps/viewer/data
