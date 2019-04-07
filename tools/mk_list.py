#!/usr/bin/env  python
# create a list from which to delete regions (limits generation process)
# A region must be in the regions.list to be processed

import os,sys
import json
import shutil
import subprocess

# error out if environment is missing
MR_SSD = os.environ["MR_SSD"]


REGION_INFO = os.path.join(MR_SSD,'../resources/regions.json')
REGION_LIST = os.environ.get("REGION_LIST")
#REGION_LIST = json.loads(REGION_LIST)
#print(REGION_LIST)
rlist = []
outstr='{"list": [\n'
with open(REGION_INFO,'r') as region_fp:
   try:
      data = json.loads(region_fp.read())
   except:
      print("regions.json parse error")
      sys.exit(1)

   for region in data['regions'].keys():
      outstr += '  "' +region + '",\n'
   outstr = outstr[:-2]
   outstr += '\n]\n}\n'
print(outstr)
