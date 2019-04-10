#### Consolidate all resources for Generating Regional Maps ####
1. General Objectives

    1. Accomodate various map outputs -- admin console, map splash, as well as provide the base for regional subset detail.mbtiles assemblies.
    2. Facilitate use of parcel-bundler for development. (I was amazed that it just worked, without the extensive configuration that webpack requires).
    3. Transition to webpack for final outputs, because of single bundle generation.

1. The sources for the various outputs are in top level osm-source directory
1. Input to both parcel-bundler, and webpack, are in the root directory of the transpiler). They both want to have inputs specified and generic (i.e. -- index.html, and main.js). So index.html, and main.js are inputs. But the actual sources in the maps repo are in top level "osm-source" directory
1. Use scripts to get, put, diff from/to transpiler directory to osm-source/subdirectories.
1. Get, put, and dif are script aliases defined by splash, base, console -- in an effort to simplify the transpiler complexity.

#### Keeping track of What's authoritative ####
1. This repo, "maps", is authoritative except for transpiled bundles, and map data (ocean.mbtiles, cities1000.sql, countries.json, bboxes.geojson). Unleashkids.org are source for these map data items.
2. All of the files on unleashkids.org relating to maps have been consolidated into http://content/OSM/vector-maps/maplist.
3. ../maplist has an index.html, and displays the standard list of regions (using a non-authoritative ../assets).
4. The authoritative copies of map data are at  http://content/OSM/vector-maps/maplist/hidden/ and are browseable via the ../hidden/ url.
5. The jquery and osm_functions.js files are copies, non-authoritative, to help the maplist function properly.
6. The tools directory has an update-unleashed script which guarantees that ukids items are in sync.
7. For production, webpack generates output to the webpack/build director. The put alias copies the most recent build to the osm-source/build directory (not tracked by git).
