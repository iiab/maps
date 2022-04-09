#!/usr/bin/env python2
# print the second line in each file in this directory to stdout
import glob
import os
#import pdb;pdb.set_trace()

flist = glob.glob("./*")

for f in sorted(flist):
   if f[-1:] == '~': continue
   if f.find('mbtiles') != -1:continue

   if os.path.isfile(f):
      with open(f,"r") as fd:
         lines = fd.readlines()
         lineno = 0
         for line in iter(lines):
             lineno += 1
             if len(line.strip()) < 3: continue
             if line[0:2] == '#!': continue
             if line.strip()[0] != '#': continue
             if len(line) == 0: continue
             if line.find('coding') != -1:continue
             if lineno > 10: break

             print("%25s -- %s"%(f,line))
             break

