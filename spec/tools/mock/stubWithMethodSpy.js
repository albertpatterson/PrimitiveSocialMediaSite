
function addStubMethodSpy(stub, name, output){
    // create an object whose "called"" property is a promse that will be resolved
    // when the method idetified by "name" is called

    let _resolve;
    
    stub[name] = function(){
        _resolve(Array.prototype.slice.call(arguments));
        if(output){
            return output;
        }
    };

    stub[name].called = new Promise(r=>_resolve=r);
}

class StubWithMethodSpy{
    constructor(name, output){
        addStubMethodSpy(this, name, output)
    }
}

module.exports.addStubMethodSpy = addStubMethodSpy;
module.exports.StubWithMethodSpy = StubWithMethodSpy;
