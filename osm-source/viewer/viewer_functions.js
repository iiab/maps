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

function readMapCatalog(path){
	//console.log ("in readMapCalalog");
	// read regions.json from common/assets in case osm vectors not installed
  regionList = [];
  var resp = $.ajax({
    type: 'GET',
    url: path + 'regions.json',
    dataType: 'json'
  })
  .done(function( data ) {
  	 regionJson = data;
    window.mapCatalog = regionJson['regions'];
  });
  //.fail(jsonErrhandler);
  return resp;
}

function get_item(layer,selector){
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
         var fname = get_item(layer,'ows:Identifier');
         var swest = get_item(layer,'ows:LowerCorner');
         var neast = get_item(layer,'ows:UpperCorner');
         var format = $(layer).find("Format");
         //console.log("fn:" + fname + ' swest:' + swest + ' neast:' + neast + ' format' + format[0].textContent);
         return resp;
     })
   })
}
function renderRegionList(checkbox) { // generic
	var html = "";
   // order the regionList by seq number
   var regions = regionList;
	console.log ("in renderRegionList");

	// sort on basis of seq
  regions = regions.sort(function(a,b){
    if (a.seq < b.seq) return -1;
    else return 1;
    });
  //console.log(regions);
	// render each region
   html += '<form>';
	regions.forEach((region, index) => { // now render the html
      //console.log(region.title + " " +region.seq);
      html += genRegionItem(region,checkbox);
  });
  html += '</form>';
  //console.log(html);
  $( "#mapRegionSelectList" ).html(html);
}


function genRegionItem(region,checkbox) {
  var html = "";
  console.log("in genRegionItem: " + region.name);
  var itemId = region.title;
  var ksize = region.size / 1000;
  //console.log(html);
  html += '<div class="extract" data-region={"name":"' + region.name + '"}> ';
  html += '<label>';
  if ( checkbox ) {
    if (selectedMapItems.indexOf(region.name) != -1)
      checked = 'checked';
    else
      checked = '';
      html += '<input type="checkbox" name="' + region.name + '"';
      html += ' onChange="updateMapSpace(this)" ' + checked + '> ';
  }
  html += itemId;
  if ( checkbox ) { html += '</input>';};
  html += '</label>'; // end input
  html += ' ' + readableSize(ksize);
  html += '</div>';
  //console.log(html);

  return html;
}

function renderMap(){
   console.log('in renderMap');
   window.map.setTarget($("#map-container")[0]);
   window.map.render();
   renderRegionList(true);
}
function initMap(){
   var url =  mapAssetsDir + 'regions.json';
//   sysStorage.map_selected_size = 0; // always set to 0
   if (UrlExists(url)){
      $.when(getMapStat()).then(renderRegionList);
   }
}
function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}
