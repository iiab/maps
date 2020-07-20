#!/bin/bash

cp -r assets/* /library/www/osm-vector-maps/viewer/assets/

cp -r build/* /library/www/osm-vector-maps/viewer/

cp jsonserver.php /library/www/osm-vector-maps/viewer/

cp -r data/geojson/* /library/www/osm-vector-maps/viewer/data/geojson/

cp markers/* /library/www/osm-vector-maps/viewer/markers/

rsync -r data/ /library/www/osm-vector-maps/viewer/data





