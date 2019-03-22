#!/bin/bash -x
# Zip up the bundles and transfer them to location where they will be published

# first check that the environment has been set
MG=${MR_SSD}
if [ "$MG" == "" ];then
   echo "Have you set the environment variables via 'source ./setenv'"
   exit 1
fi

URL_TARGET=$MAP_DL_URL
pushd $MR_HARD_DISK/output/stage4
for package in $(ls -d *); do
   echo $package|grep zip
   if [ $? -eq 0 ];then continue; fi
   ls $package.zip 
   if [ $? -ne 0 ]; then
      zip -ry ${package}.zip $package/
      md5sum ${package}.zip > $package.zip.md5
   fi   
   resp=$(curl -s --head http://$URL_TARGET/$package.zip | grep HTTP | cut -d' ' -f2)
   case $resp in
   200 | 301)  ;;
   *) cp $package.zip $MAP_UPLOAD_TARGET
   ;;
   esac
done
popd
