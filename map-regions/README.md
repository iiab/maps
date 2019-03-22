#### Consolidate all resources for Generating Regional Maps ####
A. General Objectives

    1. Accomodate various map outputs -- admin console, map splash, as well as provide the base for regional subset detail.mbtiles assemblies.
    2. Facilitate use of packet-bundler for development.
    3. Transition to webpack for final outputs, because of single bundle generation.

B. The sources for the various outputs are in top level osm-vector directory
C. Input to both packet-bundler, and webpack, are src (one directory up). They both want to have inputs specified. So index.html, and main.js are inputs. But the sources, related to these inputs, and outputs in the iiab directory tree will be descriptive, not generic.
D. Use scripts to get, put, diff from/to source directory at osm-vector.
E. Get, put, and dif are scropt aliases defined by spash, base, console -- in an effort to simplify the transpiler complexity.
