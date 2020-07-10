import json

print("hello")

my_details = {
    'name': 'John Doe',
    'age': 29
}



with open("data.json","w") as file:
    json.dump(my_details,file)

file.close()    
