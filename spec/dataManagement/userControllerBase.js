const proxyquire = require('proxyquire');

const dataInitializer = require("../../dataManagement/dataInitializer");
// const UserController = require('../../dataManagement/userController');

// fake data of users
const peter = {
    name: "Peter Griffin",
    dob: "2000 01 01",
    zip: 111111,
    biz: "Peter's Biz",
    pic: "Peter's picture"
};

const ashley = {
    name: "Ahsley",
    dob: "1970 11 15",
    zip: 123456,
    biz: "Ahsley's Biz",
    pic: "Ahsley's picture"
};

function createDecorationChecker(obj1){
    return function(obj2){
        var keys1 = Object.keys(obj1),
            keys2 = Object.keys(obj2);
        
        // expect the two objects to have the same properties
        keys2.forEach((key)=>expect(keys1).toContain(key));

        // expect the two objects to have the same values
        keys2.forEach((key)=>expect(obj1[key]).toEqual(obj2[key]));
    };
}

function createUserChecker(obj1){
    return function(user){
        var keys1 = Object.keys(obj1),
            userModel = dataInitializer.user(user.name, user.dob, user.zip, user.biz, user.pic),
            keys2 = Object.keys(userModel);
                
        // expect the two objects to have the same properties
        keys2.forEach((key)=>expect(keys1).toContain(key));

        // expect the two objects to have the same values for the keys that are stored directly
        directlyStoredKeys = keys2.filter(key=>key!=='pic');
        directlyStoredKeys.forEach((key)=>expect(obj1[key]).toEqual(userModel[key]));

        // expect the pic to be processed to remove the "/public" prefix
        expect(obj1.pic).toBe('/'+userModel.pic.slice(10,userModel.pic.length).replace('\\','/'))
    };
}

function createShallowComparisonChecker(obj1){
    return function(obj2){
        var keys1 = Object.keys(obj1).sort(),
            keys2 = Object.keys(obj2).sort();
        
        // expect the two objects to have the same properties
        expect(keys1).toEqual(keys2);

        // expect the two objects to have the same values
        keys2.forEach((key)=>expect(obj1[key]).toEqual(obj2[key]));
    };
}

class UserControllerBaseSpec{

    constructor(databaseManagerPath, databaseManagerTestUrl){
        
        databaseManagerTestUrl = databaseManagerTestUrl || '';

        const DatabaseManager = require(databaseManagerPath);
        const databaseManager = new DatabaseManager(databaseManagerTestUrl)
        // this.userController = proxyquire(
        //                         '../../dataManagement/userController', 
        //                         {
        //                             // './databaseManager': DatabaseManager,
        //                             // '../../../../private/socialMediaDatabasePrivateURL': databaseManagerTestUrl
        //                         });
        const UserController = require('../../dataManagement/userController');
        this.userController = new UserController(databaseManager);
                                
        this.databaseManager = this.userController.databaseManager;
        // this.userController = new UserController.constructor(this.databaseManager);
        // this.userController = userController;

        this.fakeUsers = {peter:peter, ashley: ashley};
    }

    customExpect(obj1){
        return {
            toBeUser: createUserChecker(obj1),
            toDecorate: createDecorationChecker(obj1),
            toShallowEqual: createShallowComparisonChecker(obj1)
        };
    }

    runTests(databaseManagerPath, databaseManagerTestUrl){

        var testCase = this;
            
        describe("The userController controls queries/updates to the database in response to user actions", 
            function(){
                
                beforeAll(
                    function(done){
                        testCase.databaseManager.connectToDatabase()
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    }
                )

                afterAll(
                    function(done){
                        testCase.databaseManager.close()
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    }
                )

                beforeEach(
                    function(done){
                        testCase.databaseManager.clearDatabase()
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    });

                afterEach(
                    function(done){
                        testCase.databaseManager.clearDatabase()
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    });
                
                it('should find a user in the database via the "getUser" command', 
                    function(done){

                        // insert a user into the database
                        var insertedUser;
                        testCase.databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
                        .then(function(){
                            return testCase.databaseManager.findUser(peter.name);
                        })
                        .then(function(peterDoc){
                            // record the user data that was inserted
                            insertedUser = peterDoc;
                            // get the user via the userController
                            return testCase.userController.getUser(peter.name)
                        })
                        // verify that the correct information is returned
                        .then(function(userDoc){
                            testCase.customExpect(userDoc).toShallowEqual(insertedUser);
                        })  
                        .then(done) 
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    });

                it('should report true from the "checkUser" command when a user exists in the database',
                    function(done){
                        
                        // insert a user (peter) into the database
                        testCase.databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
                        // check if peter is a valid user via the userController
                        .then(function(){
                            return testCase.userController.checkUser(peter.name);
                        })
                        // peter was just added and should be valid
                        .then(function(isPeterValid){
                            expect(isPeterValid).toBe(true);
                        })
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    });

                it('should report false from the "checkUser" command when a user does not exist in the database',
                    function(done){
                        // check if a non-existent user is in the database
                        testCase.userController.checkUser("Blake")
                        // Blake should not be valid as no users were added to the database
                        .then(function(isValid){
                            expect(isValid).toBe(false);
                        })
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    });
                
                
                it('should add a user to the database via the "addUser" method',
                    function(done){
                        
                        // verify that the list of users is initially empty
                        testCase.databaseManager.countUsers()
                        .then(function(count){
                            expect(count).toBe(0);
                        })
                        // add a user (Peter) via the userController
                        .then(function(){
                            return testCase.userController.addUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic);
                        })
                        // verify that the number of users is now increased by 1
                        .then(function(){
                            return testCase.databaseManager.countUsers();
                        })                            
                        .then(function(count){
                            expect(count).toBe(1);
                        })
                        // verify that the added user has the correct data
                        .then(function(){
                            return testCase.databaseManager.findUser(peter.name);
                        })
                        // verify that the Peter's information was recorded correctly
                        .then(function(peterDoc){
                            testCase.customExpect(peterDoc).toBeUser(peter);
                        })
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    });

                it('should error when attempting to add a user with the same name as an existing user',
                    function(done){
                        
                        var expectedError = 'user name "Peter Griffin" already in use.';

                        // add a user (Peter) via the userController
                        testCase.userController.addUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
                        // try to add peter again
                        .then(function(){
                            return testCase.userController.addUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic);
                        })
                        // expect an error to be thrown such that "then" is never called
                        .then(function(){
                            expect(false).toBe(true)
                        })
                        .catch(function(err){
                            expect(err.message).toBe(expectedError)
                        })
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    });
                    
            
                it('should update a user\'s "followedBy" array when the "followUser" method is called', 
                    function(done){
                        
                        // add two users to the database: peter and ashley
                        testCase.databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
                        .then(function(){
                            return testCase.databaseManager.insertUser(ashley.name, ashley.dob, ashley.zip, ashley.biz, ashley.pic);
                        })
                        // have ashley follow peter via the userController
                        .then(function(){
                            return testCase.userController.followUser(peter.name, ashley.name);
                        })
                        // verify that ashley has been added to peter's followedBy array
                        .then(function(){
                            return testCase.databaseManager.findUser(peter.name);
                        })
                        .then(function(peterDoc){
                            expect(peterDoc.followedBy[peterDoc.followedBy.length-1]).toBe(ashley.name);
                        })
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    });
                
                it('should add a post to the "posts" collection and notify following users when "addPost" method is called',
                    function(done){
                        
                        var postContent = "A post from Peter";
                        
                        // add two users to the database: peter and ashley
                        testCase.databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
                        .then(function(){
                            return testCase.databaseManager.insertUser(ashley.name, ashley.dob, ashley.zip, ashley.biz, ashley.pic);
                        })
                        // have ashley follow peter via the userController
                        .then(function(){
                            return testCase.userController.followUser(peter.name, ashley.name);
                        })
                        // verify that there are initially no posts
                        .then(function(){
                            return testCase.databaseManager.countPosts();
                        })
                        .then(function(postCount){
                            expect(postCount).toBe(0);
                        })
                        // verify that neither Peter nor Ashley have been notified of any posts so far
                        .then(function(){
                            return Promise.all([testCase.databaseManager.findUser(peter.name), testCase.databaseManager.findUser(ashley.name)]);
                        })
                        .then(function(docs){
                            var peterDoc = docs[0];
                            var ashleyDoc = docs[1];
                            expect(peterDoc.followedPosts.length).toBe(0);
                            expect(ashleyDoc.followedPosts.length).toBe(0);
                        })
                        // have peter add a post
                        .then(function(){
                            return testCase.userController.addPost(peter.name, postContent);
                        })
                        // verify there is now 1 post
                        .then(function(){
                            return testCase.databaseManager.countPosts();
                        })
                        .then(function(postCount){
                            expect(postCount).toBe(1);
                        })
                        // verify that the post is from peter and that it has the correct content                    
                        .then(function(){
                            return testCase.databaseManager.findPost(0);
                        })
                        .then(function(postDoc){
                            // verify that the new post has the correct posts
                            expect(postDoc.poster).toBe(peter.name);
                            //verify that the new post has the correct data
                            expect(postDoc.content).toBe(postContent);   
                        })
                        // verify that Ashley and Peter were notified of the post
                        .then(function(){
                            return Promise.all([testCase.databaseManager.findUser(peter.name),testCase.databaseManager.findUser(ashley.name)]);
                        })
                        .then(function(docs){
                            var peterDoc = docs[0];
                            var ashleyDoc = docs[1];
                            expect(peterDoc.followedPosts[0]).toBe(0);
                            expect(ashleyDoc.followedPosts[0]).toBe(0);
                        })
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    });
                
                function addUserWithPosts(postType){

                        // the field of the user's document to update
                        var field

                        if(postType==='followed'){
                            field = 'followedPosts';
                        }else if(postType==='message'){
                            field = 'messages';
                        }else{
                            throw new Error('Posts must be of type "followed" or "message"');
                        }

                        var expPostIdxs = [ 1, 2];
                        var fakePosts = [{idx: 0, poster: "a", content: "b"}, {idx: 1, poster: "c", content: "d"}, {idx: 2, poster: "e", content: "f"}];
                        var expPosts = fakePosts.filter((el, idx)=>!(expPostIdxs.indexOf(idx)===-1));
                                // add a user, Peter to the database
                        return  testCase.databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
                                // update Peter with some fake posts (followed or messages)
                                .then(function () {
                                    return testCase.databaseManager.updateUser(peter.name, field, expPostIdxs);
                                })
                                // add several fake posts to the database                                
                                .then(function(){
                                    Promise.all(fakePosts.map(post=>testCase.databaseManager.insertPost(post.idx, post.poster, post.content)));
                                })
                                .then(function(){
                                    return {user: peter, expPosts:expPosts};
                                })
                }

                it('should return an user\'s followed posts when the "getPosts" method is called with the "followed" option',
                    function(done){

                        // the user and the posts the user is expected to follow
                        var user, expFollowedPosts;

                        // add a user with some fake posts
                        addUserWithPosts('followed')
                        // get peter's followed posts via the userController
                        .then(function(setup){
                            user = setup.user;
                            expFollowedPosts = setup.expPosts;
                            return testCase.userController.getPosts(user.name, 'followed');
                        })
                        // verify that the correct post information is returned
                        .then(function(actFollowedPosts){
                            for(var idx in actFollowedPosts){
                                testCase.customExpect(actFollowedPosts[idx]).toDecorate(expFollowedPosts[idx]);
                            }
                        })
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })
                    });

                it('should return an user\'s messages posts when the "getPosts" method is called with the "messages" option',
                    function(done){
                         // the user and the posts the user is expected to follow
                        var user, expMessagePosts;

                        // add a user with some fake messages
                        addUserWithPosts('message')
                        // get peter's followed posts via the userController
                        .then(function(setup){
                            user = setup.user;
                            expMessagePosts = setup.expPosts;
                            return testCase.userController.getPosts(user.name, 'message');
                        })
                        // verify that the correct post information is returned
                        .then(function(actMessagePosts){
                            for(var idx in actMessagePosts){
                                testCase.customExpect(actMessagePosts[idx]).toDecorate(expMessagePosts[idx]);
                            }
                        })
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })
                    });

                it('should return the number of posts for a user when the getMessageCount method is called',
                    function(done){
                         // the user and the posts the user is expected to follow
                        var user, expMessageCount;

                        // add a user with some fake messages
                        addUserWithPosts('message')
                        // get peter's followed posts via the userController
                        .then(function(setup){
                            user = setup.user;
                            expMessageCount = setup.expPosts.length;
                            return testCase.userController.getMessageCount(user.name);
                        })
                        // verify that the correct post information is returned
                        .then(function(actMessageCount){
                            expect(actMessageCount).toBe(expMessageCount)
                        })
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })
                    });

                it('should perform an action for a group of users when the "forEachUser" method is called',
                    function(done){

                        // insert 5 fake users and record their names
                        var insertUserProms = [];
                        var fakeUsers = [];
                        var peter = testCase.fakeUsers.peter;
                        var nameBase = 'Peter';
                        var name = nameBase;
                        for(var idx=0; idx<5; idx++){
                            fakeUsers.push({name: name});
                            insertUserProms.push(testCase.databaseManager.insertUser(name, peter.dob, peter.zip, peter.biz, peter.pic));
                            name = name + nameBase;
                        }
                        
                        // find the names of the fake users that are long
                        var hasLongName = user => user.name.length > 15;
                        var expectedLongNames = fakeUsers.filter(hasLongName).map(fakeUser=>fakeUser.name);
                        
                        // find the names of the actual users that are long, using the userController
                        var actualLongNames = [];
                        Promise.all(insertUserProms)
                        .then(function(){            
                            return testCase.userController.forEachUser(
                                    {$where: "this.name&&this.name.length>15"},
                                    (user)=>actualLongNames.push(user.name))
                            })
                        .then(function(){
                            expect(actualLongNames.sort()).toEqual(expectedLongNames.sort());
                        })
                        .then(done)
                        .catch(function(err){
                            console.log(err.stack)
                        })                        
                    })
            })
    }
}

module.exports = UserControllerBaseSpec;