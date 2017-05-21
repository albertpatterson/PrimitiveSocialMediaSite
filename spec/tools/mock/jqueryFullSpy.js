define(['jquery', 'createFullSpy'], function(jQReal, createFullSpy){

    var JQFullSpyWithFactory;

    JQFullSpy = createFullSpy(jQReal);

    // create a fullSpy of a real jquery object
    var jQRealObj = jQReal(document);
    function createJQFullSpyObj(identifier){
        var JQFullSpyObj = createFullSpy(jQRealObj);
        JQFullSpyObj.identifier=identifier;
        JQFullSpyWithFactory.instances.push(JQFullSpyObj);
        return JQFullSpyObj;
    }
    
    // create a mock of the jquery function which includes the list of instances of jquery mocks
    JQFullSpyWithFactory = Object.assign(createJQFullSpyObj, JQFullSpy);
    JQFullSpyWithFactory.instances = [];
    JQFullSpyWithFactory.findInstances = (filterFun)=>JQFullSpyWithFactory.instances.filter(inst=>filterFun(inst.identifier));
    
    return JQFullSpyWithFactory;
})