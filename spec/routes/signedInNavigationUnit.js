const proxyquire = require('proxyquire').noCallThru();
const ExpressMock = require('../mock/expressMock');
const stubWithMethodSpy = require('../mock/stubWithMethodSpy');
const RequestStub = require('../mock/RequestStub');

describe('The signIn route should handle sign in, sign up and signout', function(){
    var signInNavigation;

    var userControllerStub ={};
    var validateUserStub = 'validateUser';
    var setMessageCountStub = 'setMessageCount';
    var age = 19;
    beforeEach(function(){
        
        // reset userControllerStub
        for(var prop in userControllerStub){
            delete userControllerStub[prop];
        }

        const expressMock = new ExpressMock();

        signedInNavigation = proxyquire(
            '../../routes/signedInNavigation',
            {
                '../dataManagement/userController': userControllerStub,
                'express': expressMock,
                './validateUser': validateUserStub,
                './setMessageCount': setMessageCountStub,
                './utils/calculateAge': ()=>age
            })
    })

    it('should use the validateUser and setMessageCount middleware',function(){
        expect(signedInNavigation.inputs.use.length).toBe(2);
        expect(signedInNavigation.findRoute('use',validateUserStub)).toBeDefined();
        expect(signedInNavigation.findRoute('use',setMessageCountStub)).toBeDefined();
    })

    it('should handle get requests to go home, view messages, or view another user\'s profile',function(){
        expect(signedInNavigation.inputs.get.length).toBe(3);
        expect(signedInNavigation.findRoute('get','/home')).toBeDefined();
        expect(signedInNavigation.findRoute('get','/viewMessages')).toBeDefined();
        expect(signedInNavigation.findRoute('get','/otherUser')).toBeDefined();
    })

    it('should retrieve the user\'s followed posts and message count then render the user\s home page on the home route', function(done){
        var homeHandler = signedInNavigation.findRoute('get','/home')[1];
        var userName = "userA";
        var messageCount = 7;
        var posts = ['A', 'B', 'C'];
        var reqStub = new RequestStub({userName, messageCount});
        stubWithMethodSpy.addStubMethodSpy(userControllerStub, 'getPosts', Promise.resolve(posts));
        var resStub = new stubWithMethodSpy.StubWithMethodSpy('render');

        homeHandler(reqStub, resStub, null);

        userControllerStub.getPosts.called
        .then(function(getPostArgs){
            expect(getPostArgs).toEqual([userName, 'followed']);
        })
        .then(function(){
            return resStub.render.called
        })
        .then(function(renderArgs){
            expect(renderArgs).toEqual(['homePage.pug', {messageCount, latestPosts: JSON.stringify(posts)}])
        })
        .then(done)
    })

    it('should retrieve the user\'s messages and then render the home page on the view messages route', function(done){
        
        var viewMessagesHandler = signedInNavigation.findRoute('get','/viewMessages')[1];
        
        var userName = "userA";
        var messages = ['A', 'B', 'C',];
        var messageCount = messages.length;
        var reqStub = new RequestStub({userName, messageCount});
        stubWithMethodSpy.addStubMethodSpy(userControllerStub, 'getPosts', Promise.resolve(messages));
        var resStub = new stubWithMethodSpy.StubWithMethodSpy('render');

        viewMessagesHandler(reqStub, resStub, null);

        userControllerStub.getPosts.called
        .then(function(getPostArgs){
            expect(getPostArgs).toEqual([userName, 'message']);
        })
        .then(function(){
            return resStub.render.called
        })
        .then(function(renderArgs){
            expect(renderArgs).toEqual(['homePage.pug', {messageCount, latestPosts: JSON.stringify(messages)}])
        })
        .then(done)
    })

    it('should retrieve another user\'s info and then render that users page on the other user route', function(done){
        var otherUserHandler = signedInNavigation.findRoute('get','/otherUser')[1];
        var messageCount = 7;
        var otherUserDoc = {
                                name: 'userB',
                                dob: '12/12/12',
                                age,
                                zip: 123456,
                                biz: 'job',
                                business: 'job',
                                pic: 'fakePicSrc',
                                canInteract: true
                            };

        var reqStub = new RequestStub({messageCount},{},{name: otherUserDoc.name});
        stubWithMethodSpy.addStubMethodSpy(userControllerStub, 'getUser', Promise.resolve(otherUserDoc));
        var resStub = new stubWithMethodSpy.StubWithMethodSpy('render');

        otherUserHandler(reqStub, resStub, null);

        userControllerStub.getUser.called
        .then(function(getUserArgs){
            expect(getUserArgs).toEqual([otherUserDoc.name]);
        })
        .then(function(){
            return resStub.render.called
        })
        .then(function(renderArgs){
            var expRengerArgs= {   
                                    messageCount,
                                    name: otherUserDoc.name,
                                    age, 
                                    zip: otherUserDoc.zip, 
                                    business: otherUserDoc.biz, 
                                    picSrc: otherUserDoc.pic,
                                    canInteract: otherUserDoc.canInteract
                                };
            expect(renderArgs).toEqual(['othersPage.pug', expRengerArgs])
        })
        .then(done)
    })

    it('should handle a post request to search for other users', function(){
        expect(signedInNavigation.inputs.post.length).toBe(1);
        expect(signedInNavigation.findRoute('post','/doSearch')).toBeDefined();
    })

    it('should call userController.forEachUser to filter users in the do search route, using the provided filter', function(done){
        var otherUserHandler = signedInNavigation.findRoute('post','/doSearch')[1];
        var messageCount = 7;
        var pattern = '';
        var fakeMatches = [{name:'bob'}, {name:'jill'}, {name:'kim'}];


        var resolve;

        var reqStub = new RequestStub({messageCount},{pattern});
        stubWithMethodSpy.addStubMethodSpy(userControllerStub, 'forEachUser', new Promise(r=>resolve=r));
        var resStub = new stubWithMethodSpy.StubWithMethodSpy('render');

        otherUserHandler(reqStub, resStub, null);

        userControllerStub.forEachUser.called
        .then(function(forEachUserArgs){
            var actFilter = forEachUserArgs[0];
            //expect the filter to be applied to the user name
            expect(Object.keys(actFilter)).toEqual(['name']);
            expect(actFilter.name instanceof RegExp).toBe(true);

            var iteratorFcn = forEachUserArgs[1];
            expect(iteratorFcn instanceof Function).toBe(true);
            fakeMatches.forEach(m=>iteratorFcn(m));
            resolve();
        })
        .then(function(){
            return resStub.render.called
        })
        .then(function(renderArgs){                                
            expect(renderArgs.length).toBe(2);
            expect(renderArgs[0]).toBe('searchResults.pug');
            var renderParams = renderArgs[1];
            expect(Object.keys(renderParams)).toEqual(['messageCount', 'pattern', 'matches']);
            expect(renderParams.matches.length).toBe(matches.length);
        })
        .then(done)
    })
})