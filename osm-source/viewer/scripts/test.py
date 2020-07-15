url = "../data/sparql/metroquery"
with open(url, 'r') as file:
    query = file.read().replace('\n', '')
    print(query)