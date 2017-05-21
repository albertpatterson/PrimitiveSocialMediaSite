const proxyquire = require('proxyquire').noCallThru();
const ExpressMock = require('../tools/mock/expressMock');
const stubWithMethodSpy = require('../tools/mock/stubWithMethodSpy');
const RequestStub = require('../tools/mock/RequestStub');

const expressMock = new ExpressMock();

var userControllerStub ={};

var validateUserStub = function(){return 'validateUserStub'};

describe('The signedInAjax route handles ajax requests made throught the app', function(){
    var validateUser, followUserHandler, postContentHandler;

    beforeEach(function(){

        // reset userControllerStub
        for(var prop in userControllerStub){
            delete userControllerStub[prop];
        }

        signedInAjax = proxyquire(  '../../routes/signedInAjax',
                                    {
                                        // '../dataManagement/userController': userControllerStub,
                                        'express': expressMock,
                                        './validateUser': validateUserStub
                                    })(userControllerStub);

        // inputs defining the follow user route
        followUserPath = signedInAjax.inputs.get[0][0];
        followUserHandler = signedInAjax.inputs.get[0][1];

        // inputs defining the post content route
        postContentPath = signedInAjax.inputs.post[0][0];
        postContentHandler = signedInAjax.inputs.post[0][1];
    })

    it('should use the validateUser route and provide routing to follow user and post content',function(){
        // expect for there to be a single assignment to get
        expect(signedInAjax.inputs.get.length).toBe(1);
        // expect two inputs (path & handler) to define the follow user route
        expect(signedInAjax.inputs.get[0].length).toBe(2);
        // expect the first input to be the path
        expect(followUserPath).toEqual('/followUser');
        // expect the second input to be the middleware function
        expect(typeof followUserHandler).toBe("function");


        // expect for there to be a single assignment to post
        expect(signedInAjax.inputs.post.length).toBe(1);
        // expect two inputs (path & handler) to define the post content route
        expect(signedInAjax.inputs.post[0].length).toBe(2);
        // expect the first input to be the path
        expect(postContentPath).toEqual('/postContent');
        // expect the second input to be the middleware function
        expect(typeof postContentHandler).toBe("function");

        // expect for there to be a single assignment to use from validate user
        expect(signedInAjax.inputs.use.length).toBe(1);
        // expect one input, which is the stub
        expect(signedInAjax.inputs.use[0].length).toBe(1);
        // expect the first input to be the stub
        expect(signedInAjax.inputs.use[0][0]).toBe(validateUserStub());


        // // expect no other router methods to be used
        // otherRouterMethods = Object.keys(signedInAjax.inputs).filter(key=>(key!=="get"&&key!=="post"&&key!=="use"));
        // for(var method of otherRouterMethods){
        //     expect(signedInAjax.inputs[method].length).toBe(0);
        // }
    })

    it("should call userController.followUser in the follow user route", function(done){

        var userName = "userA",
            followeeName = "userB";

        // add a "followUser" method to the userControllerStub
        stubWithMethodSpy.addStubMethodSpy(userControllerStub,"followUser", Promise.resolve());
        var reqStub = new RequestStub({userName}, null, {followeeName});
        var resStub = new stubWithMethodSpy.StubWithMethodSpy("send");

        followUserHandler(reqStub, resStub, null);
        
        userControllerStub.followUser.called
        .then(function(followUserArgs){
            expect(followUserArgs[0]).toBe(followeeName);
            expect(followUserArgs[1]).toBe(userName);
        })
        .then(function(){
            return resStub.send.called
        })
        .then(function(sendArgs){
            expect(sendArgs).toEqual([]);
        })
        .then(done);

    })

    it("should call userController.addPost in the post content route", function(done){

        var userName = "userA",
            content = "post content",
            recipient = "userB";


        stubWithMethodSpy.addStubMethodSpy(userControllerStub,"addPost", Promise.resolve(userName));
        var reqStub = new RequestStub({userName}, {content, recipient});
        var resStub = new stubWithMethodSpy.StubWithMethodSpy("send", userName);

        postContentHandler(reqStub, resStub, null);
        
        userControllerStub.addPost.called
        .then(function(addPostArgs){
            expect(addPostArgs).toEqual([userName, content, recipient]);
        })
        .then(function(){
            return resStub.send.called
        })
        .then(function(sendArgs){
            expect(sendArgs).toEqual([userName]);
        })
        .then(done);
    })
})