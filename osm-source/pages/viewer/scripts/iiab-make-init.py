#!/usr/bin/python3
# -*- coding: UTF-8 -*-
"""Writes init.json """
import sys
import argparse
import json

# GLOBALS
VIEWER_PATH = '/library/www/osm-vector-maps/viewer'
CATALOG_PATH = '/etc/iiab/map-catalog.json'

if len(sys.argv) != 2:
    print("Argument 1=map_url")
    sys.exit(1)

def get_map_catalog():
    """returns CATALOG_PATH entries"""
    input_json = CATALOG_PATH
    with open(input_json, 'r') as regions:
        reg_str = regions.read()
        map_catalog = json.loads(reg_str)
    #print(json.dumps(map_catalog, indent=2))
    return map_catalog

def parse_args():
    """returns parsed args"""
    parser = argparse.ArgumentParser(description="Create init.json for a tile URL.")
    parser.add_argument("map_url", help="The 'detail_url' field in mapcatalog.json.")
    return parser.parse_args()

def main():
    """create init.json which sets initial coords and zoom"""
    args = parse_args()
    map_catalog = get_map_catalog()
    catalog = map_catalog['maps']
    #for k in catalog.keys():
      #print(k)
    map2 = catalog.get(args.map_url,{})
    if  len(map2) == 0:
        print('Download URL not found in map-catalog.json: %s'%args.map_url)
        sys.exit(1)

    init = {}
    map3 = catalog[args.map_url]
    init['region'] = map3['region']
    init['zoom'] = map3['zoom']
    init['center_lon'] = map3['center_lon']
    init['center_lat'] = map3['center_lat']
    init_fn = VIEWER_PATH + '/init.json'
    with open(init_fn,'w') as init_fp:
        init_fp.write(json.dumps(init,indent=2))

if __name__ == '__main__':
    main()
