var catalog = {
        "hospital"  :{
            "query_file_name" : "hospitalquery.sparql",
            "feature_icon_name" : "hospital.png",
            "query_title" : "Hospital",
            "query_id" : '1'
        },
        "airport" : {
            "query_file_name" : "airport.sparql",
            "feature_icon_name" : "airport.png",
            "query_title" : "Airport",
            "query_id" : '2'
        },
        "bus-station" : {
            "query_file_name" : "bustation.sparql",
            "feature_icon_name" : "bus-station.png",
            "query_title" : "Bus Station",
            "query_id" : '3'
        },
        "library" : {
            "query_file_name" : "library.sparql",
            "feature_icon_name" : "library.png",
            "query_title" : "Library",
            "query_id" : '4'
        },
        "national-park" : {
            "query_file_name" : "nationalparks.sparql",
            "feature_icon_name" : "national-park.png",
            "query_title" : "National Park",
            "query_id" : '5'
        },
        "railway-station" : {
            "query_file_name" : "railwaystation.sparql",
            "feature_icon_name" : "railway-station.png",
            "query_title" : "Railway Station",
            "query_id" : '6'
        },
        "school" : {
            "query_file_name" : "schoolsnearby.sparql",
            "feature_icon_name" : "school.png",
            "query_title" : "School",
            "query_id" : '7'
        }
}



$(document).ready(function() {
    var list = '<option selected = "selected" value ="0"> - Select - </option>';

    for(var key in catalog){
        list += "<option value='" + catalog[key].query_id + "'>" + catalog[key].query_title + "</option>";
    }

    $("#dropDown").html(list);
});


function myFunction() {
    var latitude = document.getElementById('lat').value;
    var longitude = document.getElementById('long').value;
    var radius = document.getElementById('radius').value;
    var limit = document.getElementById('limit').value;
    var output_file_name = document.getElementById('output_file_name').value;
    var feature_id = document.getElementById("dropDown").value;
    
    function inputValidation(){
        if (limit == ""){
            limit = 50
        }
        if (latitude == "" || latitude > 90 || latitude < -90 ){
            alert("Invalid Latitude Value!");
            return false;
        }
        else if (longitude == "" || longitude > 80 || latitude < -180 ){
            alert("Invalid longitude Value!");
            return false;
        }
        else if (radius == ""){
            alert("Radius Not entered!");
            return false;
        }
        else if (output_file_name == ""){
            alert("Output File Name Not entered!");
            return false;
        }
        else if(feature_id == "0"){
            alert("Enter Valid Feature");
            return false;
        }
        else 
        return true;
    }
    var query_name;
    if(inputValidation()){
        for(key in catalog){
            if(feature_id == catalog[key].query_id){
                feature_title = catalog[key].query_title;
                query_name = key;
            }
        }  
        content = "python sparql-to-geojson-final.py "+query_name+" "+output_file_name+" "+latitude+" "+longitude+" "+radius+" "+limit;
        document.getElementById("show").value = content;
        console.log(content);
    }

    function copyFunction(){
            var copytext = content;
            var dummy = $('<input>').val(copytext).appendTo('body').select()
            document.execCommand('copy')
            tooltip.innerHTML = "Copied!";
    
        }
        function outFunc() {
            var tooltip = document.getElementById("myTooltip");
            tooltip.innerHTML = "Copy to clipboard";
        }           
}