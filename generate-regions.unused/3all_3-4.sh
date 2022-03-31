#!/bin/bash -x
# execute steps 3 and 4 for all regions in region.list

# this process is a single button do everything from scratch approach
source setenv
if [ "$MR_HARD_DISK" == '' ];then
   echo Please run \"source seten\"
   exit 1
fi
#rm -rf $MR_HARD_DISK/stage4/*
./3assemble.sh | tee -a ./output/step34.log

./4publish.sh | tee -a ./output/step34.log
