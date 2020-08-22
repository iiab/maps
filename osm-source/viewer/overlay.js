// /////////////////////s10  Displaying GeoJSON on Map  //////////////////////////////


function createGeoJSONLayer(){


    var getImage = function(feature){
      console.log(feature.get('image'));
      var text;
      var marker_location_path = '/library/www/osm-vector-maps/viewer/markers/'
      text = "./markers/" + feature.get('iconFileName');
      console.log(text);
      return text;
    };
    
    var getText = function(feature){
      console.log(feature.get('placeLabel'))
      var text = feature.get('placeLabel');
      return text;
    }
    
    var createTextStyle = function(feature){
      return new Text({
        fill: new Fill({color: 'white', width: 2}),
        stroke: new Stroke({color: 'black', width: 2}),
        text: getText(feature)
      })
    }
    
    
    // function for styling the layer
    var styleFunction = function(feature) {
      return new Style({
        image: new Icon({
          scale: 0.7,
          rotateWithView: false,
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 1,
          src: getImage(feature)
        }),
      text: createTextStyle(feature)
     })
    };
    
    // // looping through multiple geojson files and displaying them on osm
    var layerjson = {};
    var jsonlayer = {};
    var pathdata = {};
    var geojsonobject = {};
    // var filenames = {};
    var i =0;
    var out = $.ajax({
      type: 'GET',
      url: './jsonserver.php',
      dataType: 'text'
    })
    .done(function(data) {
      var jsonnames = JSON.parse(data);
      for(i = 0;i<jsonnames.length;i++){
        var url = jsonnames[i];
        layerjson[i] = (new VectorLayer({
        source: new VectorSource({
          url: url,
          format: new GeoJSON(),
          // feature: (new GeoJSON()).readFeatures(geojsonobject)     
        }),
        style: styleFunction
      })),
      //console.log(layerjson)
      console.log(layerjson[i]);
      console.log(i);
      }
      //add layer
      for(i=0;i<jsonnames.length;i++)
      map.addLayer(layerjson[i]); 
    });
  
  
  }
  
  
  
  //displaying single geojson file on osm
  // var layerjson = {};
  // var jsonlayer = {};
  // var pathdata = {};
  // // var filenames = {};
  // var j =0;
  // var out = $.ajax({
  //   type: 'GET',
  //   url: './new.php',
  //   async: false,
  //   dataType: 'text'
  // })
  // .done(function(data) {
  //   var filenames = JSON.parse(data);
  //   var url = filenames[0];
  //   layerjson = (new VectorLayer({
  //     source: new VectorSource({
  //       url: url,
  //       format: new GeoJSON()
  //     })
  //   }))
  //   console.log(layerjson);
  // });
  // map.addLayer(layerjson);
  
  // //displaying hard-coded geojson on osm
  // var pubLIbUrl = './data/geojson/metrowithtype.geojson';
  // var pubLIbLayer = new VectorLayer({
  // source: new VectorSource({
  // url: pubLIbUrl,
  // format: new GeoJSON()
  // }),
  // style: styleFunction
  // });
  // map.addLayer(pubLIbLayer);
  
  
  
  // var geojsonfeature = {};
  // var iconImage = "./marker.png";
  // console.log("Initial");
  
  // //styling markers
  // var image = new Icon({
  //   scale: 0.7,
  //   rotateWithView: false,
  //   anchor: [0.5, 1],
  //   anchorXUnits: 'fraction',
  //   anchorYUnits: 'fraction',
  //   opacity: 1,
  //   src: iconImage
  // });
  
  // var styles = {
  //   'Point': new Style({
  //     image: image
  //   })
  // };
  
  
  
  function createPopupOverlay(){
  
    var container = document.getElementById('popup');
    var content_element = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    
    
    //click handler to hide the popup
    closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
    };
    
    
    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        },
        offset: [0, -10]
    });
    map.addOverlay(overlay);
    
    
    /**
     * Add a click handler to the map to render the popup.
     */
    map.on('singleclick', function(evt){
      var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature) {
        return feature;
          });
        if (feature) {
          console.log(feature);
            var geometry = feature.getGeometry();
            var coord = geometry.getCoordinates();
            var imageurl = feature.get('image');
            console.log(imageurl );
              var content = '<h3>' + feature.get('placeLabel') + '</h3>';
              content += '<img src = ' + imageurl+ '>'; 
              if(feature.get('placeDescription') !== undefined){
              content += '<h5>' + feature.get('placeDescription') + '</h5>';
              }
              content += '<h6>Coordinates : ' + feature.get('coordinates') + '</h6>'; 
              content += '<h6>Distance from Center Point : ' + feature.get('distFromCenter') + '</h6>';
              console.log(feature.get());
              if(feature.get('placeLabel') !== undefined){
                content_element.innerHTML = content;
                overlay.setPosition(coord);
                console.log(content);
              }           
            }
    });   
    
    
  
  }
  
  // /////////////////////s11  Adding popups to marker points  //////////////////////////////
  /**
   * Popup
   **/
  // //overlay to anchor the popup to the map
  
  
  createGeoJSONLayer();
  createPopupOverlay();
  