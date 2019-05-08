## Getting started with MAPs ##
1. Go to /opt/iiab on your test machine -- can be your laptop, but I find it easier to be ssh'd into a remote machine.
1. Clone the public maps repo from https://github.com/iiab/maps.
2. On github, fork your own copy of the iiab repo.
3. To your local clone of the iiab/maps repo, add a pointer to your fork (git remote add \<your moniker\> http://github.com/\<your github account\>/maps).
4. Checkout the "simple" branch which is a bare bones invocation of openlayers on OSM "detail.mbtiles" file.
4. Execute ./maps/generate-regions/1setup.sh to add additional functionality (mostly via npm).
5. Verify that your environment has been set up correctly to compile a webpack openlayers application.
     1. Navigate to /opt/iiab/maps/generate-regions/pack
     2. Source the "base" script which defines useful alias's.
     3. Use the "get" alias to copy from ./maps/osm-source/base/ the two files that do the work (index.html, and main.js).
     4. Bundle up the main.js and dependencies (placed into build by webpack) by executing "npm run build".
     5. Use the './up' script to copy the built packages to /library/www/html/temp.
     6. Browse to <localhost or remote test machine ip>/temp to see whether the map is working.
     7. I find chrome javascript console useful to find out why nothing is working.
