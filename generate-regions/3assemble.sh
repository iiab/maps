#!/bin/bash -x
# Recreate the map source bundle, and merge in the regional vector subsets
# 3assemble.sh

# first check that the environment has been set
MG=${MR_SSD}
if [ "$MG" == "" ];then
   echo "Have you set the environment variables via 'source ./setenv'"
   exit 1
fi
UKIDS_BASE=http://download.iiab.io/content/OSM/vector-tiles/maplist/hidden/regional-resources
# make sure the output directory is ready
mkdir -p $MR_SSD/output/stage3/bundle

# I had many revisions before deciding on a symbolic link as cleanest solution
#  To the problem of preserving SSD space
unlink $MR_SSD/output/stage4
ln -s $MR_HARD_DISK $MR_SSD/output/stage4

# Create bundle from the contents of the map repo
rm -rf $MR_SSD/output/stage3/bundle/*
cp -rp $MR_SSD/../osm-source/regional-base/* $MR_SSD/output/stage3/bundle/

# just have one authoritative copy of some resources used everywhere
cp -rp $MR_SSD/../resources/bboxes.geojson $MR_SSD/output/stage3/bundle/
cp -rp $MR_SSD/../resources/regions.json $MR_SSD/output/stage3/bundle/

# move the source out of the way, and use webpack bundles
pushd  $MR_SSD/output/stage3/bundle
   mkdir -p src
   cp index.html main.js src
   cp -fp build/* .
popd
http://download.iiab.io/content/OSM/vector-tiles/maplist/hidden/regional-resources/satellite_z0-z7.mbtiles
wget -c  $UKIDS_BASE/satellite_z0-z7.mbtiles -P $MR_SSD/output/stage3/bundle/
wget -c  $UKIDS_BASE/cities1000.sqlite -P $MR_SSD/output/stage3/bundle/

# use python to read the mbtiles metadata, and update regions.json
$MR_SSD/../tools/update_regions.json.py

# use python to read the region.json, and assemble the packages

$MR_SSD/../tools/mk_map_packages.py

