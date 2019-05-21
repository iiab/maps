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
GENERATED_TILES = MR_SSD + '/output/stage2/'

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
      perma_ref = 'en-osm-omt_' + region
      identity = perma_ref + '_' + data['regions'][region]['date'] +'_'\
		 + MAP_VERSION 
      file_ref = identity + '.zip'
      # the folowing were to get started. Now permit independent region release
      #data['regions'][region]['perma_ref'] = perma_ref
      #data['regions'][region]['url'] = DOWNLOAD_URL+ '/' + identity + \
#                                       '/' + identity + '.zip'
      identity = perma_ref + '_sat_' + data['regions'][region]['date'] +'_'\
		 + MAP_VERSION 
      data['regions'][region]['sat_url'] = DOWNLOAD_URL+ '/' + identity + \
                                       '/' + identity + '.zip'
      data['regions'][region]['sat_is_regional'] = 'False' 
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
         data['regions'][region]['osm_size'] = row[0]

      # There may be a regional SATELLITE .mbtiles
      if data['regions'][region]['sat_is_regional'] == 'True':
         mbtile = GENERATED_TILES + region+'_sat_.mbtiles'
         # don't try to connect if not present, creates empty db
         try:
            conn = sqlite3.connect(mbtile)
            c = conn.cursor()
            sql = 'select value from metadata where name = "filesize"'
            c.execute(sql)
            row = c.fetchone()
            #print(row[0])
            if row:
               data['regions'][region]['sat_size'] = str(row[0])
            else:
               data['regions'][region]['sat_size'] = "790798336"
         except:
            data['regions'][region]['sat_size'] = "790798336"
      else:
         data['regions'][region]['sat_size'] = "790798336"

   # record combined satellite and OSM size
   total_size = int(data['regions'][region]['sat_size']) + \
                int(data['regions'][region]['osm_size'])
   data['regions'][region]['size'] = str(total_size)
   outstr = json.dumps(data,indent=2,sort_keys=True) 
   print(outstr)

with open(REGION_INFO,'w') as region_fp:
   region_fp.write(outstr)
