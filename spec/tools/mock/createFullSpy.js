define(['maskWithSpy'], function(maskWithSpy){
    
    function createFullSpy(realObj){

        fullSpy = Object.create(realObj);

        // stub each method with a spy
        var propertyName;
        for(propertyName in fullSpy){
            if(typeof fullSpy[propertyName]==='function'){
                maskWithSpy(fullSpy, propertyName);
            }
        }

        return fullSpy;
    }

    return createFullSpy;
})