const proxyquire = require('proxyquire').noCallThru();
const ExpressMock = require('../tools/mock/expressMock');
const stubWithMethodSpy = require('../tools/mock/stubWithMethodSpy');


const expressMock = new ExpressMock();

var userName;
var userValid;
var userControllerStub = {
    checkUser: function(){
        return Promise.resolve(userValid);
    }
};

var reqStub = {
    session: {userName: null}
};


describe('The validateUser checks if the users is valid prior to rendering the page and redirects to the sign in page if necessary', function(){
    var validateUser, handler1;

    beforeEach(function(){
        validateUser = proxyquire(  '../../routes/validateUser',
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

    it('it should syncronously redirect the user to the home page when the "userName" is not defined in the session and not call next',function(done){
        
        var resStub = new stubWithMethodSpy.StubWithMethodSpy('redirect');
        
        handler1(reqStub, resStub, null)
        
        resStub.redirect.called
        .then(function(redirectArgs){
            expect(redirectArgs).toEqual(['/']);
        })
        .catch(function(err){console.log(err)})
        .then(done)
    })

    it('it should call next if the user name is valid',function(done){
        
        reqStub.session.userName = "Robert";
        userValid = true;

        var nextStub = new stubWithMethodSpy.StubWithMethodSpy('next');

        handler1(reqStub, null, nextStub.next);

        nextStub.next.called
        .then(function(nextArgs){
            expect(nextArgs).toEqual([]);
        })
        .catch(function(err){console.log(err)})
        .then(done)
    })

    it('it should redirect the user to the home page when the "userName" is invalid and not call next',function(done){
        
        reqStub.session.userName = "robert";
        userValid = false;

        var resStub = new stubWithMethodSpy.StubWithMethodSpy('redirect');

        handler1(reqStub, resStub, null);

        resStub.redirect.called
        .then(function(redirectArgs){
            expect(redirectArgs).toEqual(["/"]);
        })
        .catch(function(err){console.log(err)})
        .then(done)
    })
})