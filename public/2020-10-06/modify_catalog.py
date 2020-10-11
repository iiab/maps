#!/usr/bin/env  python
# read map_catalog.json and write map_catalog.json

import os,sys
import json
import sqlite3
import datetime
import glob

MAP_DATE = '2019-10-08'
# Variables are being properly defined by environment variables
#CATALOG = os.path.join(MR_SSD,'../resources','regions.json')
CATALOG = './map-catalog.json'
DOWNLOAD_URL = 'https://archive.org/download'
#GENERATED_TILES = MR_SSD + '/output/stage2/'
GENERATED_TILES = '/library/www/html/internetarchive'
BASE_SATELLITE_SIZE = "976416768"
BASE_SATELLITE_URL = "https://archive.org/download/satellite_z0-z9_v3.mbtiles/satellite_z0-z9_v3.mbtiles"
BASE_PLANET_SIZE = "1870077952"
BASE_PLANET_URL = "https://archive.org/download/osm-planet_z0-z10_2019.mbtiles/osm-planet_z0-z10_2019.mbtiles"
PLANET_MBTILES = GENERATED_TILES + "/osm_planet_z11-z14_2019.mbtiles"

def process_catalog_list(map):
   global map_catalog
   for item in data[map].keys():
      map_id = os.path.basename(data[map][item]['detail_url'])
      if map not in map_catalog.keys():
         map_catalog[map] = {}
      map_catalog[map].update({map_id : {}})
      for (key, value) in data[map][item].items():
         map_catalog[map][map_id].update( {key : value} )
         map_catalog[map][map_id]['date'] = MAP_DATE
         map_catalog[map][map_id]['sat_url'] = 'not used'
         map_catalog[map][map_id]['detail_url'] = os.path.join(DOWNLOAD_URL,map_id,map_id)
         map_catalog[map][map_id]['bittorrent_url'] = os.path.join(DOWNLOAD_URL,map_id,map_id + '_archive.torrent')

         if map == 'maps':
            prefix =  GENERATED_TILES + '/'
         else:
            prefix = GENERATED_TILES + '/base/'
         size = os.path.getsize(prefix + map_id)
         map_catalog[map][map_id]['mbtiles_size'] = size
         if map == 'maps':
            map_catalog[map][map_id]['size'] = size + int(BASE_PLANET_SIZE) + int(BASE_SATELLITE_SIZE)
         else:
            map_catalog[map][map_id]['osm_size'] = size
            map_catalog[map][map_id]['size'] = 0


outstr = ''
map_catalog = {}
with open(CATALOG,'r') as catalog_fp:
   try:
      data = json.loads(catalog_fp.read())
   except:
      print("json error reading regions.json")
      sys.exit(1)
   process_catalog_list('maps')
   process_catalog_list('base')

   outstr = json.dumps(map_catalog,indent=2,sort_keys=True) 
   print(outstr)
   sys.exit(0)

