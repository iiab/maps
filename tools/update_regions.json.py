#!/usr/bin/env  python
# read mbtiles metada and update regions.json

import os,sys
import json
import sqlite3

MR_SSD = os.environ.get("MR_SSD",'/root/mapgen')
REGION_INFO = os.path.join(MR_SSD,'../resources','regions.json')

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
      data['regions'][region]['perma_ref'] = 'en-osm-omt_' + region
      download_url = os.environ['MAP_DL_URL']
      data['regions'][region]['url'] = download_url\
		 + '/en-osm-omt_' + region + '_' + data['regions'][region]['date'] +'_'\
		 + os.environ.get("MAP_VERSION",'v0.9') + '.zip'
   outstr = json.dumps(data,indent=2) 
   print(outstr)

with open(REGION_INFO,'w') as region_fp:
   region_fp.write(outstr)
