#!/bin/bash -x
# stimulate the openmaptiles/extracts to generate extracts

# first check that the environment has been set
MG=${MR_SSD}
if [ "$MG" == "" ];then
   echo "Have you set the environment variables via 'source ./setenv'"
   exit 1
fi


cd $MR_SSD/extracts
$MR_SSD/extracts/create-extracts.sh

