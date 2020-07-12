from geojson import FeatureCollection, Feature, Point
import geojson
import json



def main():
    features = []
    input_json = "./sparql_data.json"
    with open(input_json, "r") as file:
        reg_str = file.read()
        info = json.loads(reg_str)
        for root in info["results"]["bindings"]:

            lat = float(root["lat"]["value"])
            long = float(root["long"]["value"])
            point = Point((long,lat))
            print(type(point))
            properties = {}
        #   point = Point((79,43))
        ########################################
            for key in root:
                value = root[key]['value']
                properties[key] = value

            #print(properties)

        ##########################################
            features.append(Feature(geometry=point,properties=properties))

        collection = FeatureCollection(features)
        out_str = json.dumps(collection, indent=2, sort_keys=True)
        print(out_str)


    
    # metrofile = "./metro.geojson"
    # with open(metrofile,"w") as metro_geojson:
    #     out_str = json.dumps(collection, indent=2, sort_keys=True)
    #     metro_geojson.write(outstr)
        
        
        # for root in info["results"]["bindings"]:
        #     print(root[]["value"])
        #     placeLabel = root["placeLabel"]["value"]
            


if __name__ == '__main__':
    main()


