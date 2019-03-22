#!/usr/bin/env  python
# Output the regions in regions.json

import os,sys
import json
import shutil
import subprocess

# error out if environment is missing
MR_SSD = os.environ["MR_SSD"]
REGION_INFO = os.path.join(MR_SSD,'regions.json')
REGION_LIST = os.environ.get("REGION_LIST")
REGION_LIST = json.loads(REGION_LIST)
#print(REGION_LIST)

MR_HARD_DISK = os.environ.get("MR_HARD_DISK",'/hd/mapgen')
MAP_DATE = os.environ.get("MAP_DATE",'2019-03-09')
MAP_VERSION = os.environ.get("MAP_VERION",'v0.9')

with open(REGION_INFO,'r') as region_fp:
   data = json.loads(region_fp.read())
   for region in data['regions'].keys():
      if region in REGION_LIST:
         #print(region)
         # determine if the destination directory already exists
         target_zip = os.path.join(MR_HARD_DISK,'output/stage4',
                  os.path.basename(data['regions'][region]['url']))
         # clip off the zip extension
         target_dir = target_zip[:target_zip.rfind('.zip')]
         if os.path.exists(target_zip): continue
         ident = MAP_DATE + '_' + region + '_' + MAP_VERSION + '.mbtiles'
         if not os.path.isdir(target_dir):
         # copy the resources for displaying regional maps
            dest = os.path.join(MR_HARD_DISK,'output/stage4/fromscratch')
            shutil.copytree(os.path.join(MR_HARD_DISK,
                  'output/stage3/fromscratch'),dest)
            filename = os.path.join(target_dir,ident)
            os.rename(dest,target_dir)
            src_region = os.path.join(MR_HARD_DISK,'output',region + '.mbtiles')
            shutil.copy(src_region,filename)
            os.symlink('./' + os.path.basename(filename),os.path.dirname(filename) + "/details.mbtiles")
    
         # zip up the directory we just created
         print(target_zip)
         if not os.path.exists(target_zip):
            parent = os.path.dirname(target_zip)
            parent = os.path.realpath(parent)
            os.chdir(parent)
            print('current dir: %s'%os.getcwd())
            child_name = os.path.basename(target_dir)
            cmd = '/usr/bin/zip -yr %s -i %s/'%(target_zip,child_name, )
            print(cmd)
            subprocess.check_call(cmd)
