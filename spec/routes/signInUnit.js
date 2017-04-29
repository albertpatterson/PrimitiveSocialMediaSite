const proxyquire = require('proxyquire').noCallThru();
const ExpressMock = require('../mock/expressMock');
const stubWithMethodSpy = require('../mock/stubWithMethodSpy');
const RequestStub = require('../mock/RequestStub');

describe('The signIn route should handle sign in, sign up and signout', function(){
    var signIn;

    var userControllerStub ={};

    var multerInputs = null;
    var multerFilename = null;
    var multerStub = function(){
        multerInputs = Array.prototype.slice.call(arguments);
        return {single(name){
            multerFilename = name;
        }}
    }

    beforeEach(function(){
        
        const expressMock = new ExpressMock();

        signIn = proxyquire(
            '../../routes/signIn',
            {
                '../dataManagement/userController': userControllerStub,
                'multer': multerStub,
                'express': expressMock
            })
    })

    it('should set the destination of a file named "pic" in the doSignUp route',function(){
        var expectedDest = '../public/images';
        expect(multerInputs).toEqual([{dest:expectedDest}]);
        expect(multerFilename).toBe('pic');
    })

    it('defines two post methods to sign in or sign up and a get method to sign out',function(){
        expect(signIn.inputs.get.length).toBe(1);
        expect(signIn.findRoute('get', '/doSignOut')).toBeDefined()

        expect(signIn.inputs.post.length).toBe(2);
        expect(signIn.findRoute('post', '/doSignIn')).toBeDefined()
        expect(signIn.findRoute('post', '/doSignUp')).toBeDefined()
    })



    it('should set the userName property of the session and redirect the user to the home page in the do sign in route', function(done){

        var doSignInRouteHandler = signIn.findRoute('post', '/doSignIn')[1];

        var resStub = new stubWithMethodSpy.StubWithMethodSpy("redirect");
        var userName = "userA";
        var reqStub = new RequestStub({},{userName});

        doSignInRouteHandler(reqStub, resStub, null)

        resStub.redirect.called
        .then(function(redirectArgs){
            var homePage = "/signedIn/navigation/home";
            expect(redirectArgs).toEqual([homePage]);
            expect(reqStub.session.userName).toBe(userName);
        })
        .then(done);
    })

    it('should call the userController.addUser method in the do sign up route then set the userName and redirect the user to their profile', function(done){

        stubWithMethodSpy.addStubMethodSpy(userControllerStub, 'addUser', Promise.resolve());

        var doSignUpRouteHandler = signIn.findRoute('post', '/doSignUp')[2];
        
        var userInfo =  {
                            userName: 'userA',
                            DOB: '12/12/2012',
                            zip: 123456,
                            biz: 'business'
                        };
        var picFilePath = 'fakeFilePath';
        var reqStub = new RequestStub({},userInfo,{},{path: picFilePath});

        var resStub = new stubWithMethodSpy.StubWithMethodSpy("redirect");

        doSignUpRouteHandler(reqStub, resStub, null)

        userControllerStub.addUser.called
        .then(function(addUserArgs){
            expect(addUserArgs).toEqual([userInfo.userName, userInfo.DOB, userInfo.zip, userInfo.biz, picFilePath])
        })
        .then(function(){
            return resStub.redirect.called;
        })
        .then(function(redirectArgs){

            var profile = `/signedIn/navigation/otherUser?name=${userInfo.userName}`;
            expect(redirectArgs).toEqual([profile]);
            expect(reqStub.session.userName).toBe(userInfo.userName);
        })
        .then(done);
    })

    it('should inform the user if an error occured in the sign up process', function(done){

        var errorMessage = 'There was an error';
        stubWithMethodSpy.addStubMethodSpy(userControllerStub, 'addUser', Promise.reject(new Error(errorMessage)));

        var doSignUpRouteHandler = signIn.findRoute('post', '/doSignUp')[2];

        var reqStub = new RequestStub(null, {}, null, {});

        var resStub = new stubWithMethodSpy.StubWithMethodSpy("send");

        doSignUpRouteHandler(reqStub, resStub, null);

        resStub.send.called
        .then(function(sendArgs){
            expect(sendArgs).toEqual([errorMessage]);
        })
        .then(done);

    })

    it('should clear the userName property of the session and redirect the user to the sign in page in the do sign out route', function(done){

        var doSignOutRouteHandler = signIn.findRoute('get', '/doSignOut')[1];

        var resStub = new stubWithMethodSpy.StubWithMethodSpy("redirect");
        var userName = "userA";
        var reqStub = new RequestStub({userName});

        doSignOutRouteHandler(reqStub, resStub, null)

        resStub.redirect.called
        .then(function(redirectArgs){
            var signInPage = "/";
            expect(redirectArgs).toEqual([signInPage]);
            expect(reqStub.session.userName).not.toBeDefined();
        })
        .then(done);
    })
})