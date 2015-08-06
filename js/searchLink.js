$(document).ready(function() {
    var barDrug = JSON.parse(localStorage.getItem('barcodeResult'));
    $("#searchValue").val(barDrug);
    
    console.log(checkBtn);
    /* We hide the information menu from the user before any search is done */
    //$(".heading").hide();
    
    /* Function to fix casing on strings */
    var fixCasing = function(str) {
        str = str.toLowerCase();
        str[0] = str[0].toUpperCase();
        for (var i = 1; i < str.length; i++) {
            if (str[i-1] === " ") {
                str[i] = str[i].toUpperCase();
            }
        }
        return str;
    }
    
    var inArray = function(str, arr) {
        for (var i = 0; i < arr.length; i++) {
            if(arr[i] == str) {
                return true;
            }
        }
        return false;
    }
    /* This function will handle the task of searching information from the openFDA API */
    var searchFDA = function() {
         /* Getting the wanted search term */
    	var toAdd = $("#searchValue").val();
        
        /* Grabbing data from the JSON on the SPL of the drug */
		$.getJSON("https://api.fda.gov/drug/label.json?search=brand_name:"+toAdd, function(data) {
            var brand, generic, purpose, activeIngredient, warnings = "", instructs = "";
            /* Enabling the button on a successful query */
            checkBtn = true;
            enableBtn();
            /* Checking if the information is in the JSON and then displaying it */
            /* Displaying the instructions for the user */
            (data.results[0].description) ? 
                instructs = data.results[0].description+"<br/>" : instructs += "";
            (data.results[0].indications_and_usage) ? 
                instructs += data.results[0].indications_and_usage+"<br/>" : instructs+="";
            (data.results[0].instructions_for_use) ? 
                instructs += data.results[0].instructions_for_use+"<br/>" : instructs+="";
            (data.results[0].when_using) ? 
                instructs += data.results[0].when_using+"<br/>" : instructs += "";
            (data.results[0].storage_and_handling) ? 
                instructs += data.results[0].storage_and_handling+"<br/> " : instructs += "";
            (instructs === "") ?
                instructs = "No information found for instructions" : instructs +="";
            $("#instructions").html(instructs);
            
            /* Displaying warnings to the user */
            (data.results[0].warnings) ? 
                warnings = data.results[0].warnings + "<br/>" : warnings += "";
            (data.results[0].stop_use) ? 
                warnings += data.results[0].stop_use + "<br/>" : warnings += "";
            (data.results[0].keep_out_of_reach_of_children) ? 
                warnings += data.results[0].keep_out_of_reach_of_children + "<br/>" : warnings += "";
            (data.results[0].do_not_use) ? 
                warnings += data.results[0].do_not_use + "<br/>" : warnings += "";
            (data.results[0].ask_doctor) ? 
                warnings += data.results[0].ask_doctor + "<br/>" : warnings += "";
            (data.results[0].use_in_specific_populations) ?
                warnings += data.results[0].use_in_specific_populations + "<br/>" : warnings += "";
            (data.results[0].pregnancy) ?
                warnings += data.results[0].pregnancy + "<br/>" : warnings += "";
            (data.results[0].information_for_patients) ?
                warnings += data.results[0].information_for_patients + "<br/>" : warnings += "";
            (data.results[0].other_safety_information) ?
                warnings += data.results[0].other_safety_information + "<br/>" : warnings += "";
            (warnings === "") ? warnings = "No information found for warnings" : warnings += "";
             $("#warnings").html(warnings);
            /* Getting and dispaying brand name*/
			(data.results[0].openfda.brand_name) ? 
                brand = data.results[0].openfda.brand_name + "" : brand = "No information found for brand name.";
            brand = fixCasing(brand);
            $("#brand_name").text(brand);
            
            /* Getting and displaying generic name */
            (data.results[0].openfda.generic_name) ? 
                generic = data.results[0].openfda.generic_name + "": generic = "No information found for generic name";
			generic = fixCasing(generic);
            $("#generic_name").text(generic);
            
            /* Getting and displaying purpose */
            (data.results[0].purpose) ? 
                purpose = data.results[0].purpose + "" : purpose = "No information found for purpose.";
            $("#purpose").text(purpose);
            /* Grabbing and displaying the information for active ingredients */
            (data.results[0].active_ingredient) ? 
                activeIngredient = data.results[0].active_ingredient : activeIngredient = "No information found for active ingredients.";
            
            $("#active_ingred").text(activeIngredient);
            
            $(".heading").show();
            if (!document.querySelector('#collapse1').opened) {
                 document.querySelector('#collapse1').toggle();
             }
            if (!document.querySelector('#collapse2').opened) {
                document.querySelector('#collapse2').toggle();
            }
            
            $.getJSON("https://api.fda.gov/drug/label.json?search=generic_name:"+generic+"&count=openfda.brand_name.exact",function(jso){
                var brands = "No information for other brands", brandArr = new Array(10), arrCount = 0;
                console.log("Searching for Brands");
                if(jso.results[0]) {
                    brands = "";
                }
                for(var i = 0; i < jso.results.length && arrCount < 10; i++) {
                    var currBrand = fixCasing(jso.results[i].term + "");
                    if ((currBrand !== brand || toAdd !== currBrand) && !inArray(currBrand, brandArr)) {
                        brands += currBrand + "<br/>";
                        brandArr[arrCount] = currBrand;
                        arrCount += 1;
                    }   
               }
                
                $("#other_brands").html(brands);
            })
            .fail(function(){
                $("#other_brands").html("No information for other brands.");
            });
            
		})
        /* This function will execute will tell the user the drug ins't found when no valid json is returned  */
        .fail(function(){
            document.querySelector('#errortoast').show();
        });
        
        
        /* Third JSON request to get every single side effect and ranked by reported occurences with their reported counts */
        $.getJSON("https://api.fda.gov/drug/event.json?search=brand_name:"+ toAdd +"&count=patient.reaction.reactionmeddrapt.exact", 
                  function(data){
            var sideEffect;
            /* Grabbing the side-effects and then following four form the array */
            (data.results[0]) ? 
                sideEffect = fixCasing(data.results[0].term+"") : sideEffect = "No information found for side-effects";
            
            for(var i = 1; i < data.results.length && i < 5 ; ++i) {
                sideEffect += "<br/>"+fixCasing(data.results[i].term+"");
            }
            //sideEffect = fixCasing(sideEffect);
            $("#side_effects").html(sideEffect);
        });
    }
    /* The two ways for the user to prompt a search : clicking the search button or hitting enter */
    $("#searchBtn").click(function() {
       searchFDA();
    });
    
    $(document).keypress(function(event) {
        if (event.which === 13){
            searchFDA();
        }
    });
});

 
