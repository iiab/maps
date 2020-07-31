import argparse
import json

with open('../assets/wikidata.json') as wikidata_catalog: 
  data = json.load(wikidata_catalog)

try: 
    with 

parser = argparse.ArgumentParser(description='Get Query Type')
parser.add_argument('feature',  type=str, help='Output feature for GeoJSON')
parser.add_argument('lat', type=float, help='Input latitude for central point for SPARQL Query')
args = parser.parse_args()

if args.feature in data["wikidata"].keys():
    print(data["wikidata"][args.feature]["query_file_name"])
    