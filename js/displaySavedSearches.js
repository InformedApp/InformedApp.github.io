 $(document).ready(function() {
     
     $('#barcodescanner').click(function(){
       cordova.plugins.barcodeScanner.scan(
       function (result) {
           $.getJSON("https://api.fda.gov/drug/label.json?search=upc:" +result.text,function(data){
                $("#barMsg").text("We got a barcode\n" +
//                "Result: " + result.text + "\n" +
                "Result: " + data.results[0].openfda.brand_name + "\n" +

                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
           document.querySelector("#bardialog").toggle();
               $("barlink").attr("href","infopage.html?id="+data.results[0].openfda.brand_name);
               $("barlink").attr("data-id",data.results[0].openfda.brand_name);
               var barcode_drug =data.results[0].openfda.brand_name;
               localStorage.setItem('barcodeResult', JSON.stringify(barcode_drug));
               
           })
           .fail(function(){
               
              document.querySelector("#bardialogfail").toggle();

           });
           
          
           
          
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
         
    });
   
    $('#saveBtn').click(function(e){
        addDrug(e);
        
    });
     
    
    $(document).keypress(function(e) {
        if (e.which === 13) {
            enableBtn();
        }
    });
     
   $('#clear_drugs').on('click', function(){
    document.querySelector('#dialog').toggle();
    var accept = document.getElementById("accept");
    $('#deleteMsg').text("Clear all drugs?");
       accept.onclick = function(){
        clearAllDrugs();  
       }
     });   
     
     
 
    
//remove drug event from list
$('#drug_table').on('click','#remove_drug', function(e){
    key = $(this).data('id');
    console.log("drug from list");
    //alert(key);
    //id equal to attribute in clear link
    document.querySelector('#dialog').toggle()
    var accept = document.getElementById("accept");
    $('#deleteMsg').text("Delete " + key +"?");
    accept.onclick = function(){
    
    removeDrug(key);
        
    }
    console.log("removing drug from list"); 
});
        
    
    $('#drug_table').on('click','#more_info', function(e){
   
    key = $(this).data('id');
        
    //alert(key);    
    console.log("drug from list");
    var check_storage = JSON.parse(localStorage.getItem('drug'));
      /* if(check_storage != null){
            localStorage.delete(drug);
            alert("erasing stored drug");
        }*/       
         
    moreInfo(key);
    console.log("retrieving more information"); 
    });
     
      displayDrugs();
     
       
    
    function moreInfo(id){
         var drugList = JSON.parse(localStorage.getItem('drugs')); 
        var specific_drug;
        
        //loop to make sure we have the correct drug name to delete
        for(var i=0; i < drugList.length; i++){
            if(drugList[i].id == id){
                //alert("found a match:" + drugList[i].brand); 
                specific_drug = drugList[i];
            }
            
        }
        localStorage.setItem('drug', JSON.stringify(specific_drug));
        console.log('drug is now specified');
       
    }

});