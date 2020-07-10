from geojson import FeatureCollection, Feature, Point
import json


def main():
    features = []
    input_json = "./sparql_data.json"
    with open(input_json, "r") as file:
        reg_str = file.read()
        info = json.loads(reg_str)
        for root in info["results"]["bindings"]:
            print(root["location"]["value"])
            placeLabel = root["placeLabel"]["value"]
            loc = root["location"]["value"]
            

            

                              


if __name__ == '__main__':
    main()

print("Hello!") 

