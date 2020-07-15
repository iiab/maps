#Saving SPARQL dump to json file
from SPARQLWrapper import SPARQLWrapper, JSON
from geojson import Feature,Point, FeatureCollection
from uuid import uuid4
import geojson
import json
import argparse
import sys

def main():
    
    parser = argparse.ArgumentParser(description='Get Input and Output File Names')
    parser.add_argument('infile', type=str, help='Input filename for SPARQL Query')
    parser.add_argument('outfile', type=str, help='Output filename for GeoJSON')
    args = parser.parse_args()


    results = get_json_from_sparql(args.infile)
    # for result in results["results"]["bindings"]:
    #     print(result["placeDescription"]["value"])

    get_geojson_from_json(results,args.outfile)
    
def get_json_from_sparql(filename):
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    location_code = "Q1353"
    url = "../data/sparql/"+filename
    with open(url, 'r') as file:
        query = file.read().replace('\n', '')
        sparql.setQuery(query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return results

def get_geojson_from_json(results,filename):
    features = []
    info = results
    iconType = "metro station"
    for root in info["results"]["bindings"]:
        lat = float(root["lat"]["value"])
        long = float(root["long"]["value"])
        point = Point((long,lat))
        # print(type(point))
        properties = {'typeLabel': iconType}
        for key in root:
            value = root[key]['value']
            properties[key] = value

        features.append(Feature(geometry=point,properties=properties))

    collection = FeatureCollection(features)
    out_str = json.dumps(collection, indent=2, sort_keys=True)
    save_to_file(out_str,filename)

def save_to_file(out_str,filename):
    outputfile = "../data/geojson/"+filename+".geojson"
    with open(outputfile,"w") as file:
        file.write(out_str)
    file.close()
    print("Operation Complete")
    






if __name__ == '__main__':
    main()
