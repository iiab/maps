var catalog;
function getCatalog(){
    $.ajax({
        url:"catalog.json",
        dataType: 'json',
        async: false,
        success: function(data){
            catalog = data;
        }
    })
}

$(document).ready(function() {

    getCatalog();
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
    console.log(output_file_name);
    function inputValidation(){
        if (limit == ""){
            limit = 50
        }
        if (latitude == "" || latitude > 90 || latitude < -90 ){
            alert("Invalid Latitude Value - "+latitude+"\nShould be in range [-90,90]");
            return false;
        }
        else if (longitude == "" || longitude > 180 || latitude < -180 ){
            alert("Invalid longitude Value - "+longitude+"\nShould be in range [-180,80]");
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
        content = "python3 sparql-to-geojson-final.py "+query_name+" "+output_file_name+" "+latitude+" "+longitude+" "+radius+" "+limit;
        document.getElementById("cmdline").innerHTML = content;
        console.log(content);
    }

    
}