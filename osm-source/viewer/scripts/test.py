#!/usr/bin/python3 
import argparse
from string import Template
parser = argparse.ArgumentParser(description='Get Input and Output File Names')
parser.add_argument('lat', type=float, help='Input latitude for central point for SPARQL Query')
parser.add_argument('long', type=float, help='Input latitude for central point for SPARQL Query')
args = parser.parse_args()
point = "Hello Point({long} {lat})"
point = point.format(long = args.long, lat = args.lat)
query = Template('''
SELECT ?place ?placeLabel ?image ?location ?dist ?lat ?long ?type WHERE {
  wd:Q2341950 wdt:P625 ?loc.
  SERVICE wikibase:around {
    ?place wdt:P625 ?location.
    bd:serviceParam wikibase:center "Point($long $lat)"^^geo:wktLiteral;
      wikibase:radius "50".
  }
  OPTIONAL { ?place wdt:P18 ?image. }
  ?place wdt:P31 wd:Q16917.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  BIND(geof:distance(?loc, ?location) AS ?dist)
  BIND("small" AS ?marker_size)
  BIND("#FFC0CB" AS ?marker_color)
  BIND("library" AS ?marker_symbol)
  BIND("Point" AS ?type)
  BIND(STRBEFORE(STRAFTER(STR(?location), " "), ")") AS ?lat)
  BIND(STRBEFORE(STRAFTER(STR(?location), "Point("), " ") AS ?long)
}
 ''').substitute(long = args.long, lat = args.lat)
#query = query.format(long = args.long, lat = args.lat)
print(query)
   



