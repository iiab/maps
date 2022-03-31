#!/bin/bash -x
# use ogr2ogr to transform shapefiles into geoJSON files
# the ogr2ogr program installs via "apt-get install gdal-bin"

prefix=./
if [ $# > 0 ]; then
   prefix=$1
fi

for layer in `ls -1 $prefix*.shp`; do
   mkdir -p $prefix/build
   base=`basename $layer`
   ogr2ogr -f GeoJSON ${prefix}build/$base.json -t_srs EPSG:4326 $layer
done
