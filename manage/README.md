### How To Manage Regions ###
1. './get' and './put' in this directory sync with the public regions.json on unleashkids.org. This is the public facing control file for what is displayed on the IIAB Admin Console.
2. "dif" does a vimdiff between the work in process in ../resources/regions.json.The automation which copies regional packages to archive.org is driven by the file in ../resources.
3. The authoritative version of regions.json is in the git index for the repo 'https://github.com/iiab/maps/manage/regions.json' -- though at present this is a lie -- actually it is in my clone at https://github.com/georgejhunt/maps, until the push for release of IIAB version 7.0 is over.

