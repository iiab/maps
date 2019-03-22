see https://pvanb.wordpress.com/2017/03/06/raster2mbtiles/
synopsis:
* checkout the input format of the tiff file with gdalinfo <tiff file>
* we need 3 layer rgb format. if not modify with gdal_translate -expand rgba mymap1.tif mymap2.tif
* then change from wgs84 to spherical mercator -- gdalwarp -t_srs EPSG:3857 -r near mymap2.tif mymap3.tif
* then create a single layer at max resolution -- gdal_translate -of mbtiles mymap3.tif mymap.mbtiles
* and finally, create the lower zoom levels by dropping pixels 
