#!/usr/bin/env  python
# read mbtiles metada and update regions.json

import os,sys
import json
import sqlite3

MAP_VERSION = os.environ.get("MAP_VERSION",'v.999')
if MAP_VERSION == 'v.999':
   print('The environment is not set. Please run "source setenv"') 
   sys.exit(1)
# Variables are being properly defined by environment variables
MR_SSD = os.environ.get("MR_SSD",'/root/mapgen')
REGION_INFO = os.path.join(MR_SSD,'../resources','regions.json')
DOWNLOAD_URL = os.environ['MAP_DL_URL']

outstr = ''
region_list = []
with open(REGION_INFO,'r') as region_fp:
   try:
      data = json.loads(region_fp.read())
   except:
      print("json error reading regions.json")
      sys.exit(1)
   for region in data['regions'].keys():
      mbtile = os.path.join(MR_SSD,'output/stage2/',region+'.mbtiles')
      if region == 'world':
         mbtile = os.environ.get('PLANET_MBTILES','')
      if mbtile == '':
         print('problem with planet mbtile')
         sys.exit(1)
      try:
         conn = sqlite3.connect(mbtile)
         c = conn.cursor()
         sql = 'select value from metadata where name = "filesize"'
         c.execute(sql)
      except:
         print("ERROR dealing with region:%s"%region)
         sys.exit(1)
      row = c.fetchone()
	   #print(row[0])
      if row:
         data['regions'][region]['size'] = row[0]
      perma_ref = 'en-osm-omt_' + region
      identity = perma_ref + '_' + data['regions'][region]['date'] +'_'\
		 + MAP_VERSION 
      file_ref = identity + '.zip'
      data['regions'][region]['perma_ref'] = perma_ref
      data['regions'][region]['version'] = MAP_VERSION
      data['regions'][region]['url'] = DOWNLOAD_URL+ '/' + identity + \
                                       '/' + identity + '.zip'
   outstr = json.dumps(data,indent=2) 
   print(outstr)
#sys.exit(1)
with open(REGION_INFO,'w') as region_fp:
   region_fp.write(outstr)
