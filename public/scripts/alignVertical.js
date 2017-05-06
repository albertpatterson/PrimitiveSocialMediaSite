define([], function(){
    return function(details, mainContent){
        
        var detailsHeight = details.clientHeight;        
            
        var accessFormsHeight = document.getElementById('AccessForms').clientHeight;

        document.getElementById("detailsWhiteSpace").style.height = parseInt(0.5*(accessFormsHeight-detailsHeight)) + "px";

        var bodyHeight = document.body.clientHeight;
        var mainContentHeight = mainContent.clientHeight;

        document.getElementById("topWhiteSpace").style.height = parseInt(0.5*(innerHeight-mainContentHeight)) + "px";
    }
})