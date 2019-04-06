#!/bin/bash -x
# Recreate the map source bundle, and merge in the regional vector subsets
# 3assemble.sh

# first check that the environment has been set
MG=${MR_SSD}
if [ "$MG" == "" ];then
   echo "Have you set the environment variables via 'source ./setenv'"
   exit 1
fi

# make sure the output directory is ready
mkdir -p $MR_SSD/output/stage3/bundle

# The bundle is now part of the map repo

# make sure we start fresh
rm -rf $MR_SSD/output/stage3/bundle/*

cp -rp $MR_SSD/../osm-vector/base/* $MR_SSD/output/state3/bundle/
 
# use python to read the mbtiles metadata, and update regions.json
$MR_SSD/../tools/update_regions.json.py

# use python to read the region.json, and assemble the packages

$MR_SSD/../tools/mk_map_packages.py

