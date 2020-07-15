// map_functions.js
// copyright 2019 George Hunt

var mapList = [];
var mapAssetsDir = '/osm-vector-maps/maplist/assets/';
var consoleJsonDir = '/common/assets/'
var selectedMapItems = [];

function instMapError(data, cmd_args) {
    console.log(cmd_args);
    //cmdargs = JSON.parse(command);
    //consoleLog(cmdargs);
    console.log(cmd_args["map_id"]);
    mapDownloading.pop(cmd_args["map_id"]);
    return true;
}

function activateTooltip() {
    $('[data-toggle="tooltip"]').tooltip({
      animation: true,
      delay: {show: 500, hide: 100}
    });
}

function getMapStat(){
  // called during the init
  console.log('in getMapStat');
  readMapCatalog();
  readMapIdx();
}

var map_idx = {};
function readMapIdx(){
	//consoleLog ("in readMapIdx");
  var resp = $.ajax({
    type: 'GET',
    url: consoleJsonDir + 'vector-map-idx.json',
    dataType: 'json'
  })
  .done(function( data ) {
   //console.log(data);
   map_idx = data;
   mapInstalled = [];
   for (var map in data) {
   	 //console.log (map)
     if (data[map]) {
       mapInstalled.push(data[map]);
     }
  };
  //console.log(mapInstalled + '');
  })
  .fail(jsonErrhandler);

  return resp;
}

function jsonErrhandler(){
   console.log('Json error');
}

function readMapCatalog(){
	//console.log ("in readMapCalalog");
	// read map-catalog.json from common/assets in case osm vectors not installed
  mapList = [];
  var resp = $.ajax({
    type: 'GET',
    url: consoleJsonDir + 'map-catalog.json',
    dataType: 'json'
  })
  .done(function( data ) {
  	 mapJson = data;
    mapCatalog = mapJson['maps'];
    for(var key in mapCatalog){
      //console.log(key + '  ' + mapCatalog[key]['title']);
      mapCatalog[key]['name'] = key;
      mapList.push(mapCatalog[key]);
    }
  })
  .fail(jsonErrhandler);
  return resp;
}

function renderMapList(checkbox) { // generic
	var html = "";
   // order the mapList by seq number
   var regions = mapList;
	console.log ("in renderMapList");

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
      html += genMapItem(region,checkbox);
  });
  html += '</form>';
  //console.log(html);
  $( "#mapRegionSelectList" ).html(html);
  activateTooltip();
}

function map_is_installed(mapname){
  for (var key in map_idx)
    if (key && map_idx[key].file_name == basename(mapname)) return true
  return false;
}

function genMapItem(region,checkbox) {
  var html = "";
  var colorClass = "";
  console.log("in genMapItem: " + region.name);
  var itemId = region.title;
  var ksize = region.size / 1000;
  // is this region already insalled?
  if (map_is_installed(region.detail_url)) colorClass = 'installed';
  html += '<div class="extract" data-region="' + region.region + '" ';
  html += ' data-mapid="' + basename(region.detail_url) + '" ';
      html += ' onChange="updateCmdline(this)" >';
  html += '<label>';
  if ( checkbox ) {
    if (selectedMapItems.indexOf(region.name) != -1)
      checked = 'checked';
    else
      checked = '';
      html += '<input type="radio" name="region">';
      html += '</input>';;
  }
  html += '</label>'; // end input
  var mapToolTip = genMapTooltip(region);
  html += '<span class="map-desc ' + colorClass + '"' + mapToolTip + '>&nbsp;&nbsp;' + itemId + '</span>';
  html += ' ' + readableSize(ksize);
  html += '</div>';
  //console.log(html);

  return html;
}
function basename(path) {
     return path.replace(/.*\//, '');
}

function getInstalledVersion(permaRef){
   if (permaRef == '') return ''
   readMapIdx();
   if (permaRef in map_idx) return map_idx[permaRef].file_name;
   return ''
}
   
function genMapTooltip(map) {
  var mapToolTip = ' data-toggle="tooltip" data-placement="top" data-html="true" ';
  var re = /^.*_(v[0-9]+\.[0-9]+)\.zip/;
  var url = map.url;
  var installed = getInstalledVersion(map.perma_ref);
  if ( installed == '' ) installed = 'Not installed';
  var version = url.replace(re,'$1');
  mapToolTip += 'title="';
  mapToolTip += 'Date: ' + map.date + "  Version: " + version + '<br>';
  mapToolTip += 'Available: ' + basename(map.detail_url) +'<br>';
  mapToolTip += 'Installed: '+ installed + '"';
  //mapToolTip += 'title="<em><b>' + zim.description + '</b><BR>some more text that is rather long"';
  //console.log(mapToolTip);
  return mapToolTip;
}

function get_region_from_url(url){
  for (const region in mapCatalog ){
    if (mapCatalog[region].hasOwnProperty('url') &&
      mapCatalog[region].detail_url === url ){
      return mapCatalog[region].name;
    }
  }
  return null
}
  
function instMapItem(map_url) {
  var command = "INST-OSM-VECT-SET";
  var cmd_args = {};
  //region_id = get_region_from_url(map_url);
  //if ( !region_id ) return false;
  cmd_args['osm_vect_id'] = map_url;
  cmd = command + " " + JSON.stringify(cmd_args);
  sendCmdSrvCmd(cmd, genericCmdHandler);
  mapDownloading.push(map_url);
  if ( mapWip.indexOf(map_url) == -1 )
     mapWip.push(map_url);
  //console.log('mapWip: ' + mapWip);
  return true;
}

function updateMapSpace(cb){
  console.log("in updateMapSpace" + cb);
  var region = get_region_from_url(cb.name);
  updateMapSpaceUtil(region, cb.checked);
}

function updateMapSpaceUtil(region, checked){
  var size =  parseInt(mapCatalog[region].size);

  var modIdx = selectedMapItems.indexOf(region);

  if (checked){
    if (mapInstalled.indexOf(region) == -1){ // only update if not already installed mods
      sysStorage.map_selected_size += size;
      selectedMapItems.push(region);
    }
  }
  else {
    if (modIdx != -1){
      sysStorage.map_selected_size -= size;
      selectedMapItems.splice(modIdx, 1);
    }
  }

  displaySpaceAvail();
}

function renderMap(){
   console.log('in renderMap');
   window.map.setTarget($("#map-container")[0]);
   window.map.render();
   renderMapList(true);
}
function initMap(){
   var url =  mapAssetsDir + 'map-catalog.json';
   //sysStorage.map_selected_size = 0; // always set to 0
   if (UrlExists(url)){
      $.when(getMapStat()).then(function(){renderMapList(true);});
   }
}
function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function updateCmdline(elem){
   //console.log(elem.dataset.mapid);
   cmdline = document.getElementById('cmdline').innerHTML = 'sudo iiab-install-map-region ' + elem.dataset.mapid;
   show = elem.dataset.region['name']
}
