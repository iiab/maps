#!/bin/bash
# process geojson to mbtiles
# I cloned from https://github.com/mapbox/tippecanoe and it compiles on ubuntu16.04
# See: https://github.com/mapbox/tippecanoe#installation

prefix=./
if [ $# > 0 ]; then
   prefix=$1
fi

for f in `ls -1 ${prefix}*.json`;do
   mkdir -p $prefix/build
   base=`basename $f`
   tippecanoe -o ${prefix}/build$base.mbtiles --maximum-zoom=10 --force $f
done

