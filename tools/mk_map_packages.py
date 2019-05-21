#!/usr/bin/env  python
# Use regions.json to create regional packages in stage4

import os,sys
import json
import shutil
import subprocess

# error out if environment is missing
MR_SSD = os.environ["MR_SSD"]
REGION_INFO = os.path.join(MR_SSD,'../resources/regions.json')
REGION_LIST = os.environ.get("REGION_LIST")
PLANET = os.environ.get("PLANET_MBTILES","")
print('region.list limits processing to: %s'%REGION_LIST)
REGION_LIST = json.loads(REGION_LIST)
print(REGION_LIST)

MR_HARD_DISK = os.environ.get("MR_HARD_DISK",'/hd/mapgen')
MAP_DATE = os.environ.get("MAP_DATE",'2019-03-09')
MAP_VERSION = os.environ.get("MAP_VERION",'v0.9')

with open(REGION_INFO,'r') as region_fp:
   try:
      data = json.loads(region_fp.read())
   except:
      print("regions.json parse error")
      sys.exit(1)
   for region in data['regions'].keys():
      if region in REGION_LIST['list']:
         init = {}
         print(region)
         # determine if the destination directory already exists
         target_zip = os.path.join(MR_HARD_DISK,
                  os.path.basename(data['regions'][region]['url']))
         # clip off the zip extension
         target_dir = target_zip[:target_zip.rfind('.zip')]
         if os.path.exists(target_zip): continue
         ident = MAP_DATE + '_' + region + '_' + MAP_VERSION + '.mbtiles'
         if not os.path.isdir(target_dir):
            print("copying the bundle and making %s directory"%region)
            # copy the resources for displaying regional maps
            shutil.copytree(os.path.join(MR_SSD,
                  'output/stage3/bundle/'),target_dir)
            src_region = os.path.join(MR_SSD,'output/stage2',region + '.mbtiles')
            if region == 'world':
               src_region = PLANET 
            shutil.copy(src_region,target_dir)
            os.chdir(target_dir)
            os.symlink('./' + os.path.basename(src_region),"detail.mbtiles")
            os.symlink('./satellite_z0-z9.mbtiles' ,"satellite.mbtiles")
   
            # create init.json which sets initial coords and zoom
            init['region'] = region
            init['zoom'] = data['regions'][region]['zoom'] 
            init['center_lon'] = data['regions'][region]['center_lon'] 
            init['center_lat'] = data['regions'][region]['center_lat'] 
            init_fn = target_dir + '/init.json'
            with open(init_fn,'w') as init_fp:
               init_fp.write(json.dumps(init,indent=2))

         # zip up the directory we just created
         print(target_zip)
         if not os.path.exists(target_zip):
            print("%s does not exist. Creating it"%target_zip)
            parent = os.path.dirname(target_zip)
            parent = os.path.realpath(parent)
            os.chdir(parent)
            print('current dir: %s'%os.getcwd())
            child_name = os.path.basename(target_dir)
            cmd = '/usr/bin/zip -y -r %s  ./%s/'%(child_name + '.zip',child_name, )
            print("executing the following command:") 
            print(cmd)
            subprocess.check_call(cmd,shell=True)
