#!/usr/bin/python3 
import json
import os

a_dictionary = {"d": 4}

with open("sample_file.json", "r+") as file:
    data = json.load(file)
    data.update(a_dictionary)
    file.seek(0)
    json.dump(data, file)


