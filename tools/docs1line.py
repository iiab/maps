#!/usr/bin/env python
# print the second line in each file in this directory
import glob
import os

flist = glob.glob("./*")
for f in sorted(flist):
   if os.path.isfile(f):
      with open(f,"r") as fd:
         lines = fd.readlines()
         if len(lines) == 0 or lines[1][0] != '#': continue
         print("%s -- %s"%(f,lines[1][:-1]))

