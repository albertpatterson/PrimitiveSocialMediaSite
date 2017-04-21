module.exports = function(databaseManagerPath, databaseManagerTestUrl){
    
    databaseManager =  require(databaseManagerPath)(databaseManagerTestUrl);
    
    const dataInitializer = require("../../dataManagement/dataInitializer");
    const userController = require('../../dataManagement/userController')(databaseManager);

    var databaseManager

    // fake data of users
    var peter = {
        name: "Peter Griffin",
        dob: "2000 01 01",
        zip: 111111,
        biz: "Peter's Biz",
        pic: "Peter's picture"
    };

    var ashley = {
        name: "Ahsley",
        dob: "1970 11 15",
        zip: 123456,
        biz: "Ahsley's Biz",
        pic: "Ahsley's picture"
    };

    function countUsers(){
        var iterator =  databaseManager.findUsers(() => true);
        return new Promise(function(resolve, reject){
            var count = 0;
            iterator.forEach(() => count++, ()=>resolve(count));
        });
    }


    describe("The userController controls queries/updates to the database in response to user actions", 
        function(){
            
            beforeAll(
                function(done){
                    databaseManager.connect()
                    .then(done);
                }
            )

            afterAll(
                function(done){
                    databaseManager.close()
                    .then(done);
                }
            )

            beforeEach(
                function(done){
                    databaseManager.clearDatabase()
                    .then(done);
                });
            
            it('should find a user in the database via the "getUser" command', 
                function(done){

                    // insert a user into the database
                    var insertedUser;
                    databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
                    .then(function(peterDoc){
                        // record the user data that was inserted
                        insertedUser = peterDoc;
                        // get the user via the userController
                        return userController.getUser(peter.name)
                    })
                    .then(function (userDoc) {
                        // verify that the correct information is returned
                        for(var prop in userDoc){
                            expect(userDoc[prop]).toEqual(insertedUser[prop]);
                        }
                        done();
                    })   
                });

            it('should report true from the "checkUser" command when a user exists in the database',
                function(done){
                    
                    // insert a user (peter) into the database
                    var insertedUser;
                    databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
                    .then(function (peterDoc) {
                        // record the user data that was inserted
                        insertedUser = peterDoc;
                        // check if peter is a valid user via the userController
                        return userController.checkUser(peter.name);
                    })
                    .then(function(isPeterValid){
                        // peter was just added and should be valid
                        expect(isPeterValid).toBe(true);
                        done();
                    });
                });

            it('should report false from the "checkUser" command when a user does not exist in the database',
                function(done){
                    // check if a non-existent user is in the database
                    userController.checkUser("Blake")
                    .then(function (isValid) {
                        // Blake should not be valid as no users were added to the database
                        expect(isValid).toBe(false);
                        done();
                    });
                });
            
            
            it('should add a user to the database via the "addUser" method',
                function(done){
                    
                    // verify that the list of users is initially empty
                    countUsers()
                    .then(function(count){
                        expect(count).toBe(0);    
                        // add a user (Peter) via the userController
                        return userController.addUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic); 
                    })
                    // verify that the number of users is now increased by 1
                    .then(countUsers)
                    .then(function(count){
                        expect(count).toBe(1); 
                    })
                    // verify that the added user has the correct data
                    .then(function(){
                        return databaseManager.findUser(peter.name);
                    })
                    .then(function(peterDoc){
                        expect(peterDoc).toEqual(dataInitializer.user(peter.name, peter.dob, peter.zip, peter.biz, peter.pic));
                        done();
                    });
                });
                
        
            // it('should update a user\'s "followedBy" array when the "followUser" method is called', 
            //     function(done){
                    
            //         // add two users to the database: peter and ashley
            //         databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
            //         .then(function(){
            //             return databaseManager.insertUser(ashley.name, ashley.dob, ashley.zip, ashley.biz, ashley.pic);
            //         })
            //         // have ashley follow peter via the userController
            //         .then(function () {
            //             return userController.followUser(peter.name, ashley.name);
            //         })
            //         // verify that ashley has been added to peter's followedBy array
            //         .then(function(peterDoc){
            //             expect(peterDoc.followedBy[peterDoc.followedBy.length-1]).toBe(ashley.name);
            //             done();
            //         });
            //     });
            
            // it('should add a post to the "posts" collection and notify following users when "addPost" method is called',
            //     function(done){
                    
            //         var postContent = "A post from Peter";
                    
            //         // add two users to the database: peter and ashley
            //         databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
            //         .then(function () {
            //             return databaseManager.insertUser(ashley.name, ashley.dob, ashley.zip, ashley.biz, ashley.pic);
            //         })
            //         // have ashley follow peter via the userController
            //         .then(function () {
            //             return userController.followUser(peter.name, ashley.name);
            //         })
            //         // verify that there are initially no posts
            //         .then(databaseManager.countPosts)
            //         .then(function (postCount) {
            //             // verify that the number of posts has increased
            //             expect(postCount).toBe(0);

            //         // verify that neither Peter nor Ashley have been notified of any posts so far
            //             return Promise.all([databaseManager.findUser(peter.name), databaseManager.findUser(ashley.name)]);
            //         })
            //         .then(function(docs){
            //             peterDoc = docs[0];
            //             ashleyDoc = docs[1];
            //             expect(peterDoc.followedPosts.length).toBe(0);
            //             expect(ashleyDoc.followedPosts.length).toBe(0);

            //         // have peter add a post
            //             return userController.addPost(peter.name, postContent) 
            //         })
            //         // verify there is now 1 post
            //         .then(databaseManager.countPosts)
            //         .then(function(postCount){
            //             // verify that the number of posts has increased
            //             expect(postCount).toBe(1); 
                        
            //         // verify that the post is from peter and that it has the correct content                    
            //             return databaseManager.findPost(0);
            //         })
            //         .then(function(postDoc){
            //             // verify that the new post has the correct posts
            //             expect(postDoc.poster).toBe(peter.name);
            //             //verify that the new post has the correct data
            //             expect(postDoc.content).toBe(postContent);   
                    
            //         // verify that Ashley was notified of the post in addition to Peter
            //             return Promise.all([databaseManager.findUser(peter.name),databaseManager.findUser(ashley.name)]);
            //         })
            //         .then(function(docs){
            //             peterDoc = docs[0];
            //             ashleyDoc = docs[1];
            //             expect(peterDoc.followedPosts[0]).toBe(0);
            //             expect(ashleyDoc.followedPosts[0]).toBe(0);
            //             done();
            //         });
            //     });
            
            // it('should return an user\'s followed posts when the "getFollowedPosts" method is called',
            //     function(done){
            //         var expFollowedPostIdxs = [ 1, 2];
            //         var fakePosts = [{idx: 0, poster: "a", content: "b"}, {idx: 1, poster: "c", content: "d"}, {idx: 2, poster: "e", content: "f"}];
            //         var expFollowedPosts = fakePosts.filter((el, idx)=>!(expFollowedPostIdxs.indexOf(idx)===-1));
            //         // add a user, Peter to the database
            //         databaseManager.insertUser(peter.name, peter.dob, peter.zip, peter.biz, peter.pic)
            //         .then(function () {
            //         // update Peter with some fake followed posts
            //             return databaseManager.updateUser(peter.name, "followedPosts", expFollowedPostIdxs);
            //         })
            //         .then(function(){
            //         // add several fake posts to the database
            //             return Promise.all(fakePosts.map(post=>databaseManager.insertPost(post.idx, post.poster, post.content)));
            //         })
            //         // get peter's followed posts via the userController
            //         .then(function(){
            //             return userController.getFollowedPosts(peter.name);
            //         })
            //         // verify that the correct post information is returned
            //         .then(function(actFollowedPosts){
            //             expect(actFollowedPosts).toEqual(expFollowedPosts);
            //             done();
            //         });        
            //     });
            
            // it('should perform an action for a group of users when the "forEachUser" method is called',
            // function(done){
            
            //     // insert 5 fake users and record their names
            //     var insertUserProms = [];
            //     var fakeUsers = [];
            //     var nameBase = 'Peter';
            //     var name = nameBase;
            //     for(var idx=0; idx<5; idx++){
            //         fakeUsers.push({name: name});
            //         insertUserProms.push(databaseManager.insertUser(name, peter.dob, peter.zip, peter.biz, peter.pic));
            //         name = name + nameBase;
            //     }
                
            //     // find the names of the fake users that are long
            //     var hasLongName = user => user.name.length > 15;
            //     var expectedLongNames = fakeUsers.filter(hasLongName).map(fakeUser=>fakeUser.name);
                
            //     // find the names of the actual users that are long, using the userController
            //     var actualLongNames = [];
            //     Promise.all(insertUserProms)
            //     .then(function(){            
            //         return userController.forEachUser(
            //                 hasLongName,
            //                 (user)=>actualLongNames.push(user.name))
            //         })
            //     .then(function(){
            //         expect(actualLongNames).toEqual(expectedLongNames);
            //         done();
            //     })
            // })
        })
}