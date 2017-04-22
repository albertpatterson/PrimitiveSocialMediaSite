const dataInitializer = require("../../dataManagement/dataInitializer");

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
        this.databaseManager =  require(databaseManagerPath)(databaseManagerTestUrl);
        this.userController = require('../../dataManagement/userController')(this.databaseManager);
        this.fakeUsers = {peter:peter, ashley: ashley};
    }

    customExpect(obj1){
        return {
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
                        testCase.databaseManager.connect()
                        .then(done);
                    }
                )

                afterAll(
                    function(done){
                        testCase.databaseManager.close()
                        .then(done);
                    }
                )

                beforeEach(
                    function(done){
                        testCase.databaseManager.clearDatabase()
                        .then(done);
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
                    });

                it('should report false from the "checkUser" command when a user does not exist in the database',
                    function(done){
                        // check if a non-existent user is in the database
                        testCase.userController.checkUser("Blake")
                        // Blake should not be valid as no users were added to the database
                        .then(function(isValid){
                            expect(isValid).toBe(false);
                        })
                        .then(done);
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
                        .then(testCase.databaseManager.countUsers)
                        .then(function(count){
                            expect(count).toBe(1);
                        })
                        // verify that the added user has the correct data
                        .then(function(){
                            return testCase.databaseManager.findUser(peter.name);
                        })
                        // verify that the Peter's information was recorded correctly
                        .then(function(peterDoc){
                            testCase.customExpect(peterDoc).toDecorate(dataInitializer.user(peter.name, peter.dob, peter.zip, peter.biz, peter.pic));
                        })
                        .then(done);
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
                        .then(testCase.databaseManager.countPosts)
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
                        .then(testCase.databaseManager.countPosts)
                        .then(function(postCount){
                            expect(postCount).toBe(1);
                        })
                        // verify that the post is from peter and that it has the correct content                    
                        .then(()=>testCase.databaseManager.findPost(0))
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
                        .then(done);
                    });
                
                it('should return an user\'s followed posts when the "getFollowedPosts" method is called',
                    function(done){
                        var expFollowedPostIdxs = [ 1, 2];
                        var fakePosts = [{idx: 0, poster: "a", content: "b"}, {idx: 1, poster: "c", content: "d"}, {idx: 2, poster: "e", content: "f"}];
                        var expFollowedPosts = fakePosts.filter((el, idx)=>!(expFollowedPostIdxs.indexOf(idx)===-1));
                        // add a user, Peter to the database
                        testCase.databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
                        .then(function () {
                        // update Peter with some fake followed posts
                            return testCase.databaseManager.updateUser(peter.name, "followedPosts", expFollowedPostIdxs);
                        })
                        .then(function(){
                        // add several fake posts to the database
                            return Promise.all(fakePosts.map(post=>testCase.databaseManager.insertPost(post.idx, post.poster, post.content)));
                        })
                        // get peter's followed posts via the userController
                        .then(function(){
                            return testCase.userController.getFollowedPosts(peter.name);
                        })
                        // verify that the correct post information is returned
                        .then(function(actFollowedPosts){
                            for(var idx in actFollowedPosts){
                                testCase.customExpect(actFollowedPosts[idx]).toDecorate(expFollowedPosts[idx]);
                            }
                        })
                        .then(done)
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
                    })
            })
    }
}

module.exports = UserControllerBaseSpec;