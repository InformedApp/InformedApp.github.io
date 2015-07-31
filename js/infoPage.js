$(document).ready(function() {
    var specific_drug = JSON.parse(localStorage.getItem('drug'));
    $("#title").text(specific_drug.id);
    
    $("#side_effects").html(specific_drug.effects);
    
    $("#purpose").text(specific_drug.reason);

    $("#brand_name").text(specific_drug.brand);
    
    $("#active_ingred").text(specific_drug.active);
    
    $("#other_brands").html(specific_drug.altBrand);
    
    $("#generic_name").text(specific_drug.generic);
    
    $("#warnings").html(specific_drug.warnings);
    
    $("#instructions").html(specific_drug.instructions);
});


  