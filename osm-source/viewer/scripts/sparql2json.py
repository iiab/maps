#Saving SPARQL dump to json file


from SPARQLWrapper import SPARQLWrapper, JSON
from geojson import Feature,Point
import json

sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
sparql.setQuery("""
    SELECT ?place ?placeLabel ?location ?image ?marker_size ?marker_color ?type	?marker_symbol ?lat ?long
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

# for result in results["results"]["bindings"]:
#     print(result)
    # print(result["location"]["value"])

for result in results["results"]["bindings"]:
    print(result["location"]["value"])

# for result in results["results"]["bindings"]:
#     print('%s: %s' % (result["label"]["xml:lang"], result["label"]["value"]))
# with open("sparql_data.json","w") as file:
#     json.dump(results,file)
#     print("Done")

# file.close()