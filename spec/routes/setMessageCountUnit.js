const proxyquire = require('proxyquire').noCallThru();
const ExpressMock = require('../mock/expressMock');
const stubWithMethodSpy = require('../mock/stubWithMethodSpy');


const expressMock = new ExpressMock();

var messageCount;
var userControllerStub = {
    getMessageCount: function(){
        return Promise.resolve(messageCount);
    }
};

var reqStub = {
    session: {userName: null}
};


describe('The setMessageCount handler sets the number of messages in the session data.', function(){
    var validateUser, handler1;

    beforeEach(function(){
        validateUser = proxyquire(  '../../routes/setMessageCount',
                                    {
                                        // '../dataManagement/userController': userControllerStub,
                                        'express': expressMock
                                    })(userControllerStub);   

        handler1 = validateUser.inputs.use[0][0];
    })

    it('should use a single handler to validate the user irrespetive of the path',function(){
        // expect for there to be a single call to use
        expect(validateUser.inputs.use.length).toBe(1);
        // expect for there to be a single input
        expect(validateUser.inputs.use[0].length).toBe(1);
        // expect the input to be the middleware function
        expect(typeof handler1).toBe("function");

        // expect no other router methods to be used
        otherRouterMethods = Object.keys(validateUser.inputs).filter(key=>key!=="use");
        for(var method of otherRouterMethods){
            expect(validateUser.inputs[method].length).toBe(0);
        }
    })

    it('it should set the messageCount of the session and then call next',function(done){
        
        messageCount = 15;

        var nextStub = new stubWithMethodSpy.StubWithMethodSpy('next');

        handler1(reqStub, null, nextStub.next);

        nextStub.next.called
        .then(function(nextArgs){
            expect(nextArgs).toEqual([]);
            expect(reqStub.session.messageCount).toBe(messageCount);
        })
        .catch(function(err){console.log(err)})
        .then(done)
    })
})