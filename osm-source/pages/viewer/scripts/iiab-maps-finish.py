#!/usr/bin/python3
# -*- coding: UTF-8 -*-
"""Create the idx file in format required by js-menu system"""
import sys
import os
import argparse
import glob
import json

# GLOBALS
VIEWER_PATH = '/library/www/osm-vector-maps/viewer'
VECTOR_MAP_IDX_PATH = '/library/www/html/common/assets/vector-map-idx.json'
CATALOG_PATH = '/etc/iiab/map-catalog.json'
map_catalog = {}

if len(sys.argv) != 2:
    print("Argument 1=map_url")
    sys.exit(1)

def get_map_catalog():
    global map_catalog
    """returns contents of CATALOG_PATH"""
    input_json = CATALOG_PATH
    with open(input_json, 'r') as regions:
        reg_str = regions.read()
        map_catalog = json.loads(reg_str)
    #print(json.dumps(map_catalog, indent=2))
    return map_catalog

def write_vector_map_idx(installed_maps):
    """copied from adm_lib"""
    map_dict = {}
    idx_dict = {}
    for fname in installed_maps:
        map_dict = map_catalog['maps'].get(fname, '')
        if map_dict == '':
            continue

        # Create the idx file in format required bo js-menu system
        item = map_dict['perma_ref']
        idx_dict[item] = {}
        idx_dict[item]['file_name'] = os.path.basename(map_dict['detail_url'])
        idx_dict[item]['menu_item'] = map_dict['perma_ref']
        idx_dict[item]['size'] = map_dict['size']
        idx_dict[item]['date'] = map_dict['date']
        idx_dict[item]['region'] = map_dict['region']
        idx_dict[item]['language'] = map_dict['perma_ref'][:2]

    with open(VECTOR_MAP_IDX_PATH, 'w') as idx:
        idx.write(json.dumps(idx_dict, indent=2))

def get_installed_tiles():
    """returns installed maps"""
    installed_maps = []
    tile_list = glob.glob(VIEWER_PATH + '/tiles/*')
    for index in range(len(tile_list)):
        if tile_list[index].startswith('sat'):
            continue
        if tile_list[index].startswith('osm-planet_z0'):
            continue
        installed_maps.append(os.path.basename(tile_list[index]))
    return installed_maps

def parse_args():
    """returns parse args"""
    parser = argparse.ArgumentParser(description="Create init.json for a tile URL.")
    parser.add_argument("map_url", help="The 'detail_url' field in mapcatalog.json.")
    return parser.parse_args()

def main():
    """Create the idx file in format required by js-menu system"""
    args = parse_args()
    map_catalog = get_map_catalog()
    catalog = map_catalog['maps']
    #for k in catalog.keys():
      #print(k)
    map2 = catalog.get(args.map_url,{})
    if  len(map2) == 0:
        print('Download URL not found in map-catalog.json: %s'%args.map_url)
        sys.exit(1)

    # create init.json which sets initial coords and zoom
    init = {}
    map3 = catalog[args.map_url]
    init['region'] = map3['region']
    init['zoom'] = map3['zoom']
    init['center_lon'] = map3['center_lon']
    init['center_lat'] = map3['center_lat']
    init_fn = VIEWER_PATH + '/init.json'
    with open(init_fn,'w') as init_fp:
        init_fp.write(json.dumps(init,indent=2))

    installed_maps = get_installed_tiles()
    print('installed_maps')
    print(repr(installed_maps))
    write_vector_map_idx(installed_maps)

if __name__ == '__main__':
    main()
