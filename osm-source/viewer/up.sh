#!/bin/bash
npm run build


cp -r assets/* /library/www/osm-vector-maps/viewer/assets/


cp -r build/* /library/www/osm-vector-maps/viewer/

mkdir -p /library/www/osm-vector-maps/viewer/data/geojson
cp jsonserver.php /library/www/osm-vector-maps/viewer/
cp -r ./data/geojson/* /library/www/osm-vector-maps/viewer/data/geojson/