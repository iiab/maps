#!/usr/bin/env  python
# read mbtiles metada and update regions.json

import os,sys
import json
import sqlite3
import datetime

MAP_VERSION = os.environ.get("MAP_VERSION",'v.999')
if MAP_VERSION == 'v.999':
   print('The environment is not set. Please run "source setenv"') 
   sys.exit(1)
MAP_DATE = os.environ.get("MAP_DATE",'v.999')
BLAST_VERSION = os.environ.get("BLAST_VERSION")
# Variables are being properly defined by environment variables
MR_SSD = os.environ.get("MR_SSD",'/root/mapgen')
REGION_INFO = os.path.join(MR_SSD,'../resources','regions.json')
DOWNLOAD_URL = os.environ['MAP_DL_URL']
#GENERATED_TILES = MR_SSD + '/output/stage2/'
GENERATED_TILES = '/library/www/html/internetarchive'
BASE_SATELLITE_SIZE = "976416768"
BASE_SATELLITE_URL = "https://archive.org/download/satellite_z0-z9_v3.mbtiles/satellite_z0-z9_v3.mbtiles"
BASE_PLANET_SIZE = "1870077952"
BASE_PLANET_URL = "https://archive.org/download/osm-planet_z0-z10_2019.mbtiles/osm-planet_z0-z10_2019.mbtiles"

outstr = ''
region_list = []
with open(REGION_INFO,'r') as region_fp:
   try:
      data = json.loads(region_fp.read())
   except:
      print("json error reading regions.json")
      sys.exit(1)
   for region in data['regions'].keys():
      mbtile = os.path.join(GENERATED_TILES,region+'_z11-z14_2019.mbtiles')
      if region == 'world':
         mbtile = os.environ.get('PLANET_MBTILES','')
         data['regions'][region]['osm_size'] = "54776152064"
      if mbtile == '':
         print('problem with planet mbtile')
         sys.exit(1)
      perma_ref = region
      identity = perma_ref + '_' + data['regions'][region]['date'] +'_'\
		 + MAP_VERSION 
      file_ref = identity + '.zip'
      # the folowing were to get started. Now permit independent region release
      #data['regions'][region]['perma_ref'] = perma_ref
      if BLAST_VERSION == 'True':
         data['regions'][region]['url'] = DOWNLOAD_URL+ '/' + identity + \
                                       '/' + identity + '.zip'
      sat_identity = perma_ref + '_sat_' + data['regions'][region]['date'] +'_'\
		 + MAP_VERSION 
      data['regions'][region]['sat_url'] = DOWNLOAD_URL+ '/' + sat_identity + \
                                       '/' + sat_identity
      tile_identity = os.path.basename(mbtile)
      data['regions'][region]['detail_url'] = DOWNLOAD_URL+ '/' + tile_identity + '/'\
             + tile_identity 
      data['regions'][region]['publish'] = "True"
      #data['regions'][region]['sat_is_regional'] = 'False' 
      try:
         conn = sqlite3.connect(mbtile)
         c = conn.cursor()
         sql = 'select value from metadata where name = "filesize"'
         c.execute(sql)
      except Exception as e:
         print("ERROR -no access to metadata in region:%s"%region)
         print("Path:%s"%mbtile)
         print("sql error: %s"%e)
         sys.exit(1)
         continue
      row = c.fetchone()
	   #print(row[0])
      if row:
         data['regions'][region]['osm_size'] = row[0]
      elif region != "world":
         print("No Size data for region:%s"%region)

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
               data['regions'][region]['sat_size'] = BASE_SATELLITE_SIZE
         except:
            data['regions'][region]['sat_size'] = BASE_SATELLITE_SIZE
      else:
         data['regions'][region]['sat_size'] = BASE_SATELLITE_SIZE
         data['regions'][region]['sat_url'] = BASE_SATELLITE_URL

      # record combined satellite and OSM size
      total_size = float(data['regions'][region]['sat_size']) + \
                   float(data['regions'][region]['osm_size']) + float(BASE_PLANET_SIZE)
      data['regions'][region]['size'] = str(int(total_size))
      data['regions'][region]['date'] = MAP_DATE

   outstr = json.dumps(data,indent=2,sort_keys=True) 
   print(outstr)


now = datetime.datetime.now()
date_time = now.strftime("%y-%m-%d")
print(date_time)
output_filename = "./regions.json.%s"%date_time
with open(output_filename,'w') as region_fp:
   region_fp.write(outstr)
