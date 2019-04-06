#!/usr/bin/env  python
# read mbtiles metada and update regions.json

import os,sys
import json
import sqlite3

MR_SSD = os.environ.get("MR_SSD",'/root/mapgen')
REGION_INFO = os.path.join(MR_SSD,'resources','regions.json')

MR_HARD_DISK = os.environ.get("MR_HARD_DISK",'/hd/mapgen')

outstr = ''
region_list = []
with open(REGION_INFO,'r') as region_fp:
   data = json.loads(region_fp.read())
   for region in data['regions'].keys():
      mbtile = os.path.join(MR_HARD_DISK,'output',region+'.mbtiles')
      if not os.path.isfile(mbtile):
         mbtile = os.path.join(MR_SSD,'output',region+'.mbtiles')
      conn = sqlite3.connect(mbtile)
      c = conn.cursor()
      sql = 'select value from metadata where name = "filesize"'
      try:
         c.execute(sql)
      except:
         print("ERROR")
      row = c.fetchone()
	   #print(row[0])
      if row:
         data['regions'][region]['size'] = row[0]
      data['regions'][region]['perma_ref'] = 'en-osm-omt_' + region
      download_url = os.environ['MAP_DL_URL']
      data['regions'][region]['url'] = download_url\
		 + '/en-osm-omt_' + region + '_'\
		 + os.environ.get("MAP_VERSION",'v0.9') + '.zip'
   outstr = json.dumps(data,indent=2) 
   print(outstr)

with open(REGION_INFO,'w') as region_fp:
   region_fp.write(outstr)
