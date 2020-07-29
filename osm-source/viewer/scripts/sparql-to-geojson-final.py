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

#implement validation
#create result.query
#implement limits in every query


SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"
SPARQL_FROM_TEMPLATE_PATH = "/library/www/osm-vector-maps/viewer/data/sparql/templates/"
GEOJSON_PATH = "/library/www/osm-vector-maps/viewer/data/geojson/"

sparql = SPARQLWrapper(SPARQL_ENDPOINT, agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36')


def main():
    

    parser = argparse.ArgumentParser(description='Get Query Type')
    parser.add_argument('input_feature', choices=['hospital','airport','bus-station',' library', 'national-park', 'railway-station', 'school'], type=str, help='Input feature for SPARQL Query')
    parser.add_argument('output_filename', type=str, help='Output filename for GeoJSON')
    parser.add_argument('lat', type=float, help='Input latitude for central point for SPARQL Query')
    parser.add_argument('long', type=float, help='Input longitude for central point for SPARQL Query')
    parser.add_argument('radius', nargs='?', type=float, help='Input Radius from Central Point')
    #parser.add_argument('limit', nargs='?', type=int, help='Limit the number of Queries')
    args = parser.parse_args()

    filename = ""
    iconfile = ""
    feature_title = ""

    with open('assets/wikidata.json') as wikidata_catalog: 
        data = json.load(wikidata_catalog)
        for key, value in data["wikidata"].items():
            if(key == args.input_feature):
                filename = value["query_file_name"]
                iconfile = value["feature_icon_name"]
                feature_title = value["query_title"]


    results = get_json_from_sparql(filename, args.lat, args.long, args.radius)
    # for result in results["results"]["bindings"]:
    #     print(result["placeDescription"]["value"])
    
    get_geojson_from_json(results,args.output_filename,iconfile,feature_title)
    print("Conversion Complete")
    
def get_json_from_sparql(input_filename,lat, long, radius):
    input_file_path = SPARQL_FROM_TEMPLATE_PATH + input_filename
    with open(input_file_path, 'r') as file:
        query = file.read().replace('\n', '')
        query = Template(query).substitute(long = long, lat = lat, radius = radius)
        print(query)
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return results

#featureType dictionary that contains all the possible combinations.


def get_geojson_from_json(results, output_filename, iconfile, feature_title):
    features = []
    info = results
    for root in info["results"]["bindings"]:
        lat = float(root["lat"]["value"])
        long = float(root["long"]["value"])
        point = Point((long,lat))
        # print(type(point))
        properties = {'iconFileName': iconfile, 'Feature Title' : feature_title}
        for key in root:
            value = root[key]['value']
            properties[key] = value
            #get image
            #if(key == 'image'):
             #   print(root[key]['value'])

        features.append(Feature(geometry=point,properties=properties))

    collection = FeatureCollection(features)
    out_str = json.dumps(collection, indent=2, sort_keys=True)
    save_to_file(out_str,output_filename)

def save_to_file(out_str,filename):
    outputfile = GEOJSON_PATH+filename+".geojson"
    print(outputfile)
    with open(outputfile,"w") as file:
        file.write(out_str)
    file.close()


if __name__ == '__main__':
    main()
