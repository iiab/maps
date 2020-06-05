#!/bin/bash
npm run build

cp -r assets/* ../../webpack/assets/
cp -r assets/* /library/www/osm-vector-maps/viewer/assets/

cp -r build/* ../../webpack/assets/
cp -r build/* /library/www/osm-vector-maps/viewer/

