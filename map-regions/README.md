#### Consolidate all resources for Generating Regional Maps ####
1. General Objectives

    1. Accomodate various map outputs -- admin console, map splash, as well as provide the base for regional subset detail.mbtiles assemblies.
    2. Facilitate use of parcel-bundler for development.
    3. Transition to webpack for final outputs, because of single bundle generation.

1. The sources for the various outputs are in top level osm-vector directory
1. Input to both parcel-bundler, and webpack, are in the root directory of the transpiler). They both want to have inputs specified and generic (i.e. -- index.html, and main.js). So index.html, and main.js are inputs. But the actual sources in the maps repl, related to these inputs, and outputs in the iiab directory tree will be index.html and maps.js, not generic.
1. Use scripts to get, put, diff from/to source directory at osm-vector.
1. Get, put, and dif are scropt aliases defined by splash, base, console -- in an effort to simplify the transpiler complexity.
