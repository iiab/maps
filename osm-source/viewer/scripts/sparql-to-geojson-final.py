#Saving SPARQL dump to json file
from SPARQLWrapper import SPARQLWrapper, JSON
from geojson import Feature,Point, FeatureCollection
import geojson
import json

def main():
    results = get_json_from_sparql()
    # for result in results["results"]["bindings"]:
    #     print(result["placeDescription"]["value"])

    print("\n GeoJSON File : ")
    get_geojson_from_json(results)
    

def get_geojson_from_json(results):
    features = []
    info = results
    for root in info["results"]["bindings"]:
        lat = float(root["lat"]["value"])
        long = float(root["long"]["value"])
        point = Point((long,lat))
        # print(type(point))
        properties = {}
        for key in root:
            value = root[key]['value']
            properties[key] = value

        features.append(Feature(geometry=point,properties=properties))

    collection = FeatureCollection(features)
    out_str = json.dumps(collection, indent=2, sort_keys=True)
    print(out_str)



def get_json_from_sparql():
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    sparql.setQuery("""
    SELECT ?place ?placeLabel ?placeDescription ?location ?image ?marker_size ?marker_color ?type	?marker_symbol ?lat ?long
    WHERE {
    ?place wdt:P131 wd:Q1353 .
    ?place wdt:P31 wd:Q928830 . 
    ?place wdt:P1373 ?num
    FILTER(?num > 10000)
    ?place wdt:P625 ?location . 
    OPTIONAL { ?place wdt:P18 ?image . }
  
    BIND(STRBEFORE(STRAFTER(STR(?location), ' '), ')') AS ?lat)
    BIND(STRBEFORE(STRAFTER(STR(?location), 'Point('), ' ') AS ?long)
  
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    """)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    return results


# for result in results["results"]["bindings"]:
#     print('%s: %s' % (result["label"]["xml:lang"], result["label"]["value"]))
# with open("sparql_data.json","w") as file:
#     json.dump(results,file)
#     print("Done")

# file.close()

if __name__ == '__main__':
    main()
