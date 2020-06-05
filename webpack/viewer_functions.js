// viewer_functions.js
// copyright 2019 George Hunt

function getMapStat(){
  // called during the init
  console.log('in getMapStat');
  readMapCatalog();
  //readMapIdx();
}

function readMapIdx(){
	//consoleLog ("in readMapIdx");
  var resp = $.ajax({
    type: 'GET',
    url: consoleJsonDir + 'vector-map-idx.json',
    dataType: 'json'
  })
  .done(function( data ) {
  	//mapInstalled = data['regions'];
   //consoleLog (data);
   var mapInstalled = [];
   //mapInstalled = Object.keys(data);
   for (var map in data) {
   	 //consoleLog (map)
     if (data[map].hasOwnProperty('region')) {
       mapInstalled.push(data[map].region);
     }
  }
  //consoleLog(mapInstalled + '');
  })
  ;//.fail(jsonErrhandler);

  return resp;
}

function readMapCatalog(){
	//console.log ("in readMapCalalog");
	// read regions.json from common/assets in case osm vectors not installed
  regionList = [];
  var path = '/etc/iiab/';
  var resp = $.ajax({
    type: 'GET',
    url: path + 'regions.json',
    dataType: 'json'
  })
  .done(function( data ) {
  	 regionJson = data;
    window.mapCatalog = regionJson['regions'];
  i});
  //.fail(jsonErrhandler);
  return resp;
}

function get_item(layer,selector){
   // do match on namespaced:item using nodeName --avoid jquery namespace hell!
   var retvar = ''
   $(layer).find('*').each(function(m,child){
      if (child.nodeName === selector &&
            child.textContent !== 'default') 
         retvar = child.textContent;
   })
   return(retvar);
}

function read_mbtiles(){
   var resp = $.ajax({
      type: 'GET',
      async: true,
      url: './tileserver.php/wmts',
      dataType: 'xml'
   })
   .done(function( xml ) {
      $(xml).find('Layer').each(function(n,layer){
         var layer_info = {};
         layer_info['fname'] = get_item(layer,'ows:Identifier');
         var swest = get_item(layer,'ows:LowerCorner');
         var coords = swest.split(" ");
         layer_info['west'] = coords[0];
         layer_info['south'] = coords[1];
         var neast = get_item(layer,'ows:UpperCorner');
         var coords = neast.split(" ");
         layer_info['east'] = coords[0];
         layer_info['north'] = coords[1];
         var format = $(layer).find("Format");
         layer_info['format'] = format[0].textContent;
         window.layers.push(layer_info);
         //console.log("fn:" + fname + ' swest:' + swest + ' neast:' + neast + ' format' + format[0].textContent);
         return resp;
     })
   })
}
function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}
