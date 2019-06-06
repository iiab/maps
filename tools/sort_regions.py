#!/usr/bin/env  python
# Sort ./regions.json to stdout or compare param1 to param2

import os,sys
import json
import sqlite3

if len(sys.argv) == 3:
   REGION_INFO = sys.argv[1]
   COMPARE_INFO = sys.argv[2]
elif len(sys.argv) == 2:
   REGION_INFO = sys.argv[1]
else:
   REGION_INFO = './regions.json'

outstr = ''
with open(REGION_INFO,'r') as region_fp:
   try:
      data1 = json.loads(region_fp.read())
   except:
      print("json error reading %s"%REGION_INFO)
      sys.exit(1)
   if len(sys.argv) < 3:
      outstr = json.dumps(data1,indent=2,sort_keys=True) 
      print(outstr)
      sys.exit(1)
   else:
      with open(COMPARE_INFO,'r') as region_fp:
         try:
            data2 = json.loads(region_fp.read())
         except:
            print("json error reading regions.json")
            sys.exit(1)
         same = True
         d1 = data1['regions']
         d2 = data2['regions']
         for region1 in d1.keys():
            for key1 in d1[region1].keys():
               if d1[region1][key1] != d2[region1][key1]:
                  print('region1:%s key1:%s differ: %s<==>%s'%\
                     (region1,key1,d1[region1][key1],d2[region1][key1]))
                  same = False
print('The two json files are equivalent:%s'%same)

#with open(REGION_INFO,'w') as region_fp:
   #region_fp.write(outstr)
   #pass
