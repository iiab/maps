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
if len(sys.argv) < 2:
   print("Pass the path of the file to upload as first parameter, and category as second")
   sys.exit()
FILENAME = os.path.basename(sys.argv[1])
CATEGORY = sys.argv[2] 
MR_HARD_DISK = os.environ.get("MR_HARD_DISK",'/hd/mapgen')
MAP_DATE = os.environ.get("MAP_DATE",'2019-03-09')
MAP_VERSION = os.environ.get("MAP_VERSION",'v.999')
if MAP_VERSION == 'v.999':
   print('The environment is not set. Please run "source setenv"') 
   sys.exit(1)

# create the wrapper name for this file
wrapper = 'IIAB_' + CATEGORY + '_' + FILENAME + '_' + MAP_VERSION

# Fetch the md5 to see if local file needs uploading
with open(sys.argv[1] + '.md5','r') as md5_fp:
   instr = md5_fp.read()
   md5 = instr.split(' ')[0]
if len(md5) == 0:
   print('md5 was zero length. ABORTING')
   sys.exit(1)

# Gather together the metadata for archive.org
md = {}
md['title'] = "Resource for a Vector Map Server which runs on Raspberry Pi"
#md['collection'] = "internetinabox"
md["creator"] = "Internet in a Box" 
md["subject"] = "rpi" 
md["subject"] = "maps" 
md["licenseurl"] = "http://creativecommons.org/licenses/by-sa/4.0/"
md["zip_md5"] = md5
md["mediatype"] = "software"
md["description"] = "This reource is downloaded and assembled into a package which is then downloaded and provides offline vector maps." 

identifier = FILENAME

# Check is this has already been uploaded
item = internetarchive.get_item(identifier)
if item.metadata:
   item.metadata['zip_md5'] == md5
   # already uploaded
   print('Skipping %s -- checksums match'%region)
   sys.exit()
if item.metadata:
   print('md5sums for %s do not match'%region)
else:
   print('Archive.org does not have %s'%identifier) 
# Debugging information
print('MetaData: %s'%md)
print('Identifier: %s. Filename: %s'%(wrapper,FILENAME,))
r = internetarchive.upload(identifier, files=[sys.argv[1]], metadata=md)
print(r[0].status_code) 
