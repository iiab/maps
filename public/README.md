### How To Manage Regions ###
1. './get' and './put' in this directory sync with the public regions.json on unleashkids.org. This is the public facing control file for what is displayed on the IIAB Admin Console.
2. "diff-ukids" does a vimdiff between the ./regions.json in the current directory, and the public version at ukids. The automation which copies regional packages to archive.org is driven by the file in ../resources.
4. The Public (and authoritative source) is at https://download.unleashkids.org/content/OSM/vector-tiles/maplist/hidden/assets/regions.json. This should be in sync (via the scripts in this directory) with resources/regions.json.ukids.


## Revision history

* April 16, 2020 -- shorten title from "Spanish-speaking Regions" to "Spanish Speakers"
* Jan 27, 2020 -- Put san_jose back in with title: "World to Zoom 1"
* Dec 2019  added Spanish-speaking Regions
