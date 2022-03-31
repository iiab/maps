#!/usr/bin/env python
# create spec for regions in yaml (allows comment), then translate to json

import yaml
import json
import json
import os


def main():
   #input_json = "{{ iiab_dir }}" + '/regions.json'
   input_json = '/etc/iiab' + '/regions.json'
   with open(input_json,'r') as regions:
      reg_str = regions.read()
      info = json.loads(reg_str)
   #print(json.dumps(info,indent=2))
   
   with open('regions.yml',"w") as region_yml:
      yml = yaml.load(reg_str)
      outstr = yaml.dump(yml, default_flow_style = False)
      region_yml.write(outstr)

if __name__ == '__main__':
   main()
