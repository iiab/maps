#!/usr/bin/python3 
#Saving SPARQL dump to geojson file
from SPARQLWrapper import SPARQLWrapper, JSON
from geojson import Feature,Point, FeatureCollection
from uuid import uuid4
import geojson
import json
import argparse
import sys
from string import Template
#lookup python styles PEP-8
#camelCase -> underscores


SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"
SPARQL_FROM_TEMPLATE_PATH = "../data/sparql/templates/"
GEOJSON_PATH = "../data/geojson/"

def main():
    
    parser = argparse.ArgumentParser(description='Get Input and Output File Names')
    parser.add_argument('infile', type=str, help='Input filename for SPARQL Query')
    parser.add_argument('outfile', type=str, help='Output filename for GeoJSON')
    parser.add_argument('lat', type=float, help='Input latitude for central point for SPARQL Query')
    parser.add_argument('long', type=float, help='Input latitude for central point for SPARQL Query')
    parser.add_argument('--featureType',default='other',required=False, type=str, help='Output filename for GeoJSON')
    args = parser.parse_args()


    results = get_json_from_sparql(args.infile,args.lat,args.long)
    # for result in results["results"]["bindings"]:
    #     print(result["placeDescription"]["value"])

    get_geojson_from_json(results,args.outfile,args.featureType)
    print("Conversion Complete")
    
def get_json_from_sparql(filename,lat_value,long_value):
    sparql = SPARQLWrapper(SPARQL_ENDPOINT, agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36')
    input_file_path = SPARQL_FROM_TEMPLATE_PATH + filename
    with open(input_file_path, 'r') as file:
        query = file.read().replace('\n', '')
        query = Template(query).substitute(long = long_value, lat = lat_value)
        print(query)
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return results

#featureType dictionary that contains all the possible combinations.


def get_geojson_from_json(results,filename,featureType):
    features = []
    info = results
    featureType = featureType
    for root in info["results"]["bindings"]:
        lat = float(root["lat"]["value"])
        long = float(root["long"]["value"])
        point = Point((long,lat))
        # print(type(point))
        properties = {'featureType': featureType}
        for key in root:
            value = root[key]['value']
            properties[key] = value
            #get image
            #if(key == 'image'):
             #   print(root[key]['value'])

        features.append(Feature(geometry=point,properties=properties))

    collection = FeatureCollection(features)
    out_str = json.dumps(collection, indent=2, sort_keys=True)
    save_to_file(out_str,filename)

def save_to_file(out_str,filename):
    outputfile = GEOJSON_PATH+filename+".geojson"
    print(outputfile)
    with open(outputfile,"w") as file:
        file.write(out_str)
    file.close()


if __name__ == '__main__':
    main()