#!/usr/bin/env  python3
# Upload the Regional osm-vector maps to InernetArchive

import os,sys
sys.path.append('/usr/local/lib/python2.7/dist-packages')
import json
import shutil
import subprocess
import internetarchive

# error out if environment is missing
MR_SSD = os.environ["MR_SSD"]

REGION_INFO = os.path.join(MR_SSD,'../resources/regions.json')
REGION_LIST = os.environ.get("REGION_LIST")
PLANET = os.environ.get("PLANET_MBTILES","")
REGION_LIST = json.loads(REGION_LIST)
print('region.list limits processing to: %s'%REGION_LIST)

MR_HARD_DISK = os.environ.get("MR_HARD_DISK",'/hd/mapgen')
MAP_DATE = os.environ.get("MAP_DATE",'2019-03-09')
MAP_VERSION = os.environ.get("MAP_VERSION",'v.999')
if MAP_VERSION == 'v.999':
   print('The environment is not set. Please run "source setenv"') 
   sys.exit(1)

with open(REGION_INFO,'r') as region_fp:
   try:
      data = json.loads(region_fp.read())
   except:
      print("regions.json parse error")
      sys.exit(1)
   for region in data['regions'].keys():
      if region in REGION_LIST['list']:

         # Fetch the md5 to see if local file needs uploading
         target_zip = os.path.join(MR_HARD_DISK,
                  os.path.basename(data['regions'][region]['url']))
         with open(target_zip + '.md5','r') as md5_fp:
            instr = md5_fp.read()
            md5 = instr.split(' ')[0]
         if len(md5) == 0:
            print('md5 was zero length. ABORTING')
            sys.exit(1)

         # Gather together the metadata for archive.org
         md = {}
         md['title'] = "OpenStreetmap Vector Server for %s, runs on Raspberry Pi"%region
         #md['collection'] = "internetinabox"
         md["creator"] = "Internet in a Box" 
         md["subject"] = "rpi" 
         md["subject"] = "maps" 
         md["licenseurl"] = "http://creativecommons.org/licenses/by-sa/4.0/"
         md["zip_md5"] = md5
         md["mediatype"] = "software"
         md["description"] = "This client/server IIAB package makes OpenStreetMap data in vector format browsable from clients running Windows, Android, iOS browsers." 

         perma_ref = 'en-osm-omt_' + region
         identifier = perma_ref + '_' + data['regions'][region]['date'] \
                      + '_' +MAP_VERSION

         # Check is this has already been uploaded
         item = internetarchive.get_item(identifier)
         if item.metadata:
            item.metadata['zip_md5'] == md5
            # already uploaded
            print('Skipping %s -- checksums match'%region)
            continue
         if item.metadata:
            print('md5sums for %s do not match'%region)
         else:
            print('Archive.org does not have %s'%identifier) 
         # Debugging information
         print('Uploading %s'%region)
         print('MetaData: %s'%md)
         print('Identifier: %s. Filename: %s'%(identifier,target_zip,))
         r = internetarchive.upload(identifier, files=[target_zip], metadata=md)
         print(r[0].status_code) 
