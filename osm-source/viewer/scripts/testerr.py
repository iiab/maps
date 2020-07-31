import argparse
import json

with open('../assets/wikidata.json') as wikidata_catalog: 
  data = json.load(wikidata_catalog)

parser = argparse.ArgumentParser(description='Get Query Type')
parser.add_argument('feature',  type=str, help='Output feature for GeoJSON')
parser.add_argument('lat', type=float, help='Input latitude for central point for SPARQL Query')
args = parser.parse_args()
try: 
    if not args.feature in data["wikidata"].keys():
        raise NameError
    if args.lat not in range(-90,91):
        raise ValueError
    print(data["wikidata"][args.feature]["query_file_name"])
except ValueError : 
    print('The lat/long value is incorrect. Provide value in range.  '+str(args.lat))
except NameError : 
    print('Invalid Feature Type Entered!=>  ' + args.feature)

