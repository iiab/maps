#!/bin/bash 
# Zip up the bundles and transfer them to location where they will be published

# first check that the environment has been set
source setenv

echo Executing the 4publish.sh bash script
pushd $MR_HARD_DISK/stage4
for package in $(ls -d *.zip); do
   if [ ! -f "$package.md5" ]; then
      echo creating md5 for $package
      md5sum $package > $package.md5
   fi
done
popd

# Find out if the 
# execute the python script which uploads 
../tools/up2ia.py
