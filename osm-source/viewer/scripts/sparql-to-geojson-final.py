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

#create result.query
#implement limits in every query


SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"
SPARQL_FROM_TEMPLATE_PATH = "/library/www/osm-vector-maps/viewer/data/sparql/templates/"
GEOJSON_PATH = "/library/www/osm-vector-maps/viewer/data/geojson/"

sparql = SPARQLWrapper(SPARQL_ENDPOINT, agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36')


def main():
    
    try:
        with open('assets/wikidata.json') as wikidata_catalog: 
            data = json.load(wikidata_catalog)
    except:
        print('Error opening file!')
        exit(0)

    parser = argparse.ArgumentParser(description='Get Query Type')
    parser.add_argument('input_feature', type=str, help='Input feature for SPARQL Query')
    parser.add_argument('output_filename', type=str, help='Output filename for GeoJSON')
    parser.add_argument('lat', type=float, help='Input latitude for central point for SPARQL Query')
    parser.add_argument('long', type=float, help='Input longitude for central point for SPARQL Query')
    parser.add_argument('radius', type=float, help='Input Radius from Central Point (in km)')
    parser.add_argument('limit', nargs='?', default=100, type=int, help='Limit the number of Queries')
    args = parser.parse_args()
    
    feature = args.input_feature
    latitude = args.lat
    longitude = args.long
    radius = args.radius
    output_filename = args.output_filename
    query_limit = args.limit 

    try: 
        if not feature in data["wikidata"].keys():
            raise NameError
        if not -90 < latitude <91 :
            raise ValueError
        if not -181 < longitude <81 : 
            raise ValueError
        print('Values entered are : \nFeature Name : {} ,\nLatitude : {}, \nLongitude : {}, \nRadius:  {}, \nQuery Limit = {}'.format(feature,latitude,longitude,radius,query_limit))
        query_filename = data["wikidata"][feature]["query_file_name"]
        iconfile = data["wikidata"][feature]["feature_icon_name"]
        feature_title = data["wikidata"][feature]["query_title"]

    except ValueError : 
       print('The lat/long value is incorrect. Provide value in range.\nLatitude : (-90,90)\nLongitude : (-180,80) ')
    except NameError : 
        print('Invalid Feature Type Entered!')
    else : 
        results = get_json_from_sparql(query_filename, latitude, longitude, radius, query_limit)
        get_geojson_from_json(results,output_filename,iconfile,feature_title)
        print("Conversion Complete, copying to User_catalog")
        
        # user_single_query = {
        #     feature : {
        #     'feature' : feature,
        #     'central_lat': latitude,
        #     'central_long' : longitude,
        #     'radius': radius,
        #     'output_filename' : output_filename,
        #     'query_limit' : query_limit
        #      }
        # }

        #create_user_catalog(user_single_query)
        print('Operation Successful!')
        
    
def get_json_from_sparql(input_filename,lat, long, radius, query_limit):
    input_file_path = SPARQL_FROM_TEMPLATE_PATH + input_filename
    with open(input_file_path, 'r') as file:
        query = file.read().replace('\n', '')
        query = Template(query).substitute(long = long, lat = lat, radius = radius, limit = query_limit)
        #print(query)
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return results


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
    #print(outputfile)
    with open(outputfile,"w") as file:
        file.write(out_str)
    file.close()

# def create_user_catalog(query_data):
    
#     with open('python_dictionary.json','w') as f:
#         dic = json.load(f)
#         dic.update(query_data)
#         json.dump(dic, f)

if __name__ == '__main__':
    main()
