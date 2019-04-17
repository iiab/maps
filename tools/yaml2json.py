#!/usr/bin/env python
# Translate regions.yml to regions.json

import yaml
import json
import os


def main():
   #input_json = "{{ iiab_dir }}" + '/regions.json'
   input_yaml =  'regions.yml'
   with open(input_yaml,'r') as regions:
      reg_str = regions.read()
      info = yaml.load(reg_str)
   #print(json.dumps(info,indent=2))
   
   with open('regions.json',"w") as region_json:
      outstr = json.dumps(info, indent=2)
      region_json.write(outstr)

if __name__ == '__main__':
   main()
