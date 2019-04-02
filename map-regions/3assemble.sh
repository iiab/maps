#!/bin/bash -x
# Recreate the map source bundle, and merge in the regional vector subsets
# This stage assumes that the tile generation needs the speed of SSD, but
# that in the long run, the large files should reside on hard disk. it makes
# the transition in stage3
# 3assemble.sh

# first check that the environment has been set
MG=${MR_SSD}
if [ "$MG" == "" ];then
   echo "Have you set the environment variables via 'source ./setenv'"
   exit 1
fi

# copy the extracted mbtiles to the $MR_HARD_DISK, perhaps free up MR_SSD
for EXTRACT in $(ls $MR_SSD/output/stage2/*.mbtiles); do
   if [ ! -f $MR_HARD_DISK/output/stage3/$EXTRACT ]; then
      cp -f $MR_SSD/output/stage2/$EXTRACT $MR_HARD_DISK/output/stage3/$EXRACT
   fi
   # Free up SSD if flag is set
   if [ "$FREE_SSD" ==  'true' ]; then
      rm -f $EXTRACT
      touch $EXTRACT
   fi
done


# the following downloads all the resources to stage3/fromscratch
if [ ! -d $MR_HARD_DISK/output/stage3/fromscratch ];then

   # may need some tools from iiab-factory
   scriptdir=`dirname "$(readlink -f "$0")"`

   #prefix=./
   prefix=$MR_HARD_DISK/output/stage3/fromscratch

   # create a place to put accumulations of resources
   mkdir -p $prefix/assets
   mkdir -p $prefix/build
   cd $prefix/build

   if [ ! -d maps ]; then
      git clone https://github.com/iiab/maps
   fi
   cp -rp maps/* ..
   if [ ! -d "jquery" ]; then
      git clone git://github.com/jquery/jquery.git
   fi
   if [ ! -d "bootstrap" ]; then
      git clone git://github.com/twitter/bootstrap.git
   fi
   if [ ! -d "bootstrap-ajax-typeahead" ]; then
      git clone git://github.com/biggora/bootstrap-ajax-typeahead.git
   fi
   if [ ! -d "osm-bright-gl-style" ]; then
      git clone git://github.com/openmaptiles/osm-bright-gl-style --branch gh-pages
   fi
   cp $prefix/build/osm-bright-gl-style/sprite* $prefix/assets/
   pushd jquery
      if [ ! -f dist/jquery.min.js ]; then
         npm run build
      fi
      rsync $prefix/build/jquery/dist/jquery.min.js* $prefix/assets
   popd

   rsync $prefix/build/bootstrap/dist/js/bootstrap.min.js* $prefix/assets
   rsync $prefix/build/bootstrap/dist/css/bootstrap.min.css* $prefix/assets
    
   rsync $prefix/build/bootstrap-ajax-typeahead/js/bootstrap-typeahead.min.js* $prefix/assets/


   # get the cities sqlite database
   cd $prefix/build
   if [ ! -f cities1000.zip ]; then
   wget  http://download.geonames.org/export/dump/cities1000.zip
   unzip cities1000.zip
   fi
   if [ ! -f cities1000.sqlite ];then
      cp $scriptdir/mkfeatures.sql .
      cp $scriptdir/geodb.pl .
      sqlite3 cities1000.sqlite < mkfeatures.sql
      $prefix/build/geodb.pl
   fi
   cp cities1000.sqlite ..

   if [ ! -f ocean.mbtiles ]; then
      wget  http://download.iiab.io/packages/OSM/ocean.mbtiles
   fi
fi

if [ ! -f noto-sans-v8-latin.zip ];then
   wget http://download.iiab.io/packages/OSM/noto-sans-v8-latin.zip
   unzip -d $prefix noto-sans-v8-latin.zip
fi

# when fromscratch directory is built,  move the build directory out of the way
if [ -d $MR_HARD_DISK/output/stage3/fromscratch/build ]; then
   mv $MR_HARD_DISK/output/stage3/fromscratch/build $MR_HARD_DISK/output/stage3/
fi
 
# use python to read the mbtiles metadata, and update regions.json
$MR_SSD/../tools/update_regions.json.py

# use python to read the region.json, and assemble the packages

$MR_SSD/../tools/mk_map_packages.py

