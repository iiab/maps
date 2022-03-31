### Objectives
* Combine mbtiles from an arbitrary number of regions (available from https://openmaptiles.org/downloads).
* Provide a mode which uses all the *.mbtiles in a specified, or current directory, as source.
* Provode a second interface which accepts input from the Admin Console, and merges one mbtile at a time (thinking that the download and merge might be an atomic and repeated accumulative action).
* Permit input and output specification via full path filenames (default to current working directory).

### Inputs
* optional flag: -d \<full path\> or --dir \<full path\> -- Make the specified directory the default before appending. (optional flag must be specified before the two required parameters).
* parameter 1: -- required. If parameter 1 is a directory, append all *.mbtiles to parameter 2. If a parameter 1 is a mbtile, append it to parameter 2.
* parameter 2: -- required. Name of mbtile to which additional tile data should be appended. If parameter is full path, put output there. Otherwise put it into <default directory>/output/<parameter 2>

### Examples
1.  Add a link which makes append2region executable everywhere in the file system:
```
# the following symbolic link is an optional convenience. Do it once
ln -s /opt/iiab/iiab-factory/content/vector/tiles/append2region /usr/bin/
```
2.  The default mbtiles structure does not require that there be only one tile at the same world location, and zoom level. So it is necessary to create a new database with the required structure, and then copy in the data into that structure. The following will check  that the database file has the required structure (creating it if it does not exist):
```
append2region <source directory with many mbtiles files> (or)<full path to a single filename> \
   <full path and filename> or <.> (which specifies current directory)
```
3.  Add all the mbtiles in my download directory to a new test.mbtiles in the IIAB modules/en-osm-omt-min/ directory (requires #1 above):
```
cd /home/ghunt/downloads
append2region  . /library/www/html/modules/en-osm-omt-min/test.mbtiles
```
4. Process a source directory which includes a number of mbtile regions, and place the result in a new output directory which is directly under the source directory (assumes #1 above):
```
# go to the directory which contains the collected *.mbtiles regions of interest
cd /home/ghunt/regions/
append2region . .
#(The "." is expanded to the current working directory. The output file will be found 
#  under the current directory in ./output/combined_regions.mbtiles.
```

