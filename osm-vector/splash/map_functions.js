// map_functions.js
// copyright 2019 George Hunt
var regionGeojson = {};
var regionDict = {};
var regionList = [];
var consoleJsonDir = '/common/assets/';
var onChangeFunc = "setSize";
var $ = document.$;

//var jquery = require("./jquery.min");
//window.$ = window.jQuery = jquery;

function readBoundingBox(checkbox){
   checkbox = checkbox && true;
	console.log ("in readBoundingBox. checkbox:" + checkbox);
  var resp = $.ajax({
    type: 'GET',
    url: consoleJsonDir + 'regions.json',
    dataType: 'json'
  })
  .done(function( data ) {
  	 regionGeojson = data;
    regionDict = regionGeojson['regions'];
    for(var key in regionDict){
      console.log(key + '  ' + regionDict[key]['title']);
      regionDict[key]['name'] = key;
      regionList.push(regionDict[key]);
    }
    renderRegionList(checkbox);
  })
  .fail(jsonErrhandler);
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
  console.log(regions);
	// render each region
   html += '<form>';
	regions.forEach((region, index) => { // now render the html
      console.log(region.title + " " +region.seq);
      html += genRegionItem(region,checkbox);
  });
  html += '</form>';
  console.log(html);
  $( "#regionlist" ).html(html);
}

//readBoundingBox();

function genRegionItem(region,checkbox) {
  var html = "";
  console.log("in genRegionItem: " + region.name);
  var itemId = region.title;
  var ksize = region.size / 1000;
console.log(html);
  html += '<div  class="extract" data-region={"name":"' + region.name + '"}>';
  html += ' <label>';
  if ( checkbox ) {
      html += '<input type="checkbox" name="region"';
      html += ' onChange="totalSpace(this)">';
  }
      html += itemId;
  if ( checkbox ) { html +=  '</input>';};
  html += '</label>'; // end input
  html += ' Size: ' + readableSize(ksize);
  html += '</div>';
console.log(html);

  return html;
}

function instMapItem(name) {
  var command = "INST-OSM-VECT-SET";
  var cmd_args = {};
  cmd_args['osm_vect_id'] = name;
  cmd = command + " " + JSON.stringify(cmd_args);
  sendCmdSrvCmd(cmd, genericCmdHandler);
  mapDownloading.push(name);
  //renderOer2goCatalog();
  return true;
}

function jsonErrhandler (jqXHR, textStatus, errorThrown)
{
  // only handle json parse errors here, others in ajaxErrHandler
  if (textStatus == "parserror") {
    //alert ("Json Errhandler: " + textStatus + ", " + errorThrown);
    displayServerCommandStatus("Json Errhandler: " + textStatus + ", " + errorThrown);
  }
  //consoleLog("In Error Handler logging jqXHR");
  consoleLog(textStatus);
  consoleLog(errorThrown);
  consoleLog(jqXHR);

  return false;
}

function readableSize(kbytes) {
  if (kbytes == 0)
  return "0";
  var bytes = 1024 * kbytes;
  var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
  var e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, e)).toFixed(2) + " " + s[e];
}

function totalSpace(){
  var sum = 0;
  $( ".extract" ).each(function(ind,elem){
    var data = JSON.parse($(this).attr('data-region'));
    var region = data.name;
    var size = parseInt(regionDict[region]['size']);
    var chk = $( this ).find(':checkbox').prop("checked") == true;
    if (chk && typeof size !== 'undefined')
        sum += size;
    });
   var ksize = sum / 1000;
  $( "#osmDiskSpace" ).html(readableSize(ksize));
}
function refreshBoxLayer(){
   map.render();
}
// apply the html for region list
readBoundingBox(false);
