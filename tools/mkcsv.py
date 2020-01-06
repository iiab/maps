#!/usr/bin/env  python
# create csv file as expected by openmaptiles/extract

import os,sys
import json
import uuid

MR_SSD = os.environ.get("MR_SSD",'/root/mapgen')
REGION_INFO = os.path.join(MR_SSD,'../resources','regions.json')
REGION_LIST = os.path.join(MR_SSD,'region.list')
with open(REGION_LIST,'r') as rl:
   rlist = json.loads(rl.read())
   
print(str(rlist))
#REGION_LIST = json.loads(REGION_LIST)

with open(REGION_INFO,'r') as region_fp:
   data = json.loads(region_fp.read())
headers = 'extract,id,country,city,left,bottom,right,top\n'
target = os.path.join(MR_SSD,'output','stage1','iiab.csv')
with open(target,'w') as csv_fp:
   csv_fp.write(headers)
   for extract in data['regions'].keys():
      if extract in rlist['list']:
         outstr = '%s,%s,%s,%s,%s,%s,%s,%s\n'%(extract,uuid.uuid4().hex,'','',
             data['regions'][extract]['west'],data['regions'][extract]['south'],
             data['regions'][extract]['east'],data['regions'][extract]['north'])
         csv_fp.write(outstr)
   csv_fp.close()
