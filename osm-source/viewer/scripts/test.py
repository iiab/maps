#!/usr/bin/python3 
import json

with open('../catalog/wikidata.json') as wikidata_catalog: 
  data = json.load(wikidata_catalog)
  for key, value in data["wikidata"].items():
    if(key == "hospital"):
      print(value["query_file_name"])


