define([], function(){   

    function spy(methodName, args){
        this[methodName].calls.push(args);
    }

    function spyAsync(methodName){
        return new promise(
            function(res){
                this[methodName] = function(){
                    maskWithSpy(this, methodName)
                    this[methodName](arguments);
                    res(arguments);
                }
            }.bind(this));
    }

    function assignSpy(){

    }

    function maskWithSpy(obj, methodName){
        obj[methodName] = function(){spy.call(obj, methodName, arguments)}
        obj[methodName].async = function(){spyAsync.call(obj, methodName, arguments)};
        obj[methodName].calls = [];
    }

    return maskWithSpy;
})