#!/usr/bin/python3 
import argparse
import json

with open('../assets/wikidata.json') as wikidata_catalog: 
  data = json.load(wikidata_catalog)

for item in data["wikidata"]:
  print(item)


#print(filename)


