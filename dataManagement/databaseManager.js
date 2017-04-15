var MongoClient = require('mongodb').MongoClient;
var url = require("../../private/socialMediaDatabasePrivateURL");
var assert = require('assert');

var db = null,
    users = null,
    posts = null;

function connect(callback){

    if(db===null){
        MongoClient.connect(url, function(err, connectedDd){
            assert.equal(null, err);
            console.log("Newly connected to database");
            db = connectedDd;

            users = db.collection('users');
            posts = db.collection('posts');

            if(typeof callback === 'function'){
                callback(err, db);
            }
        })
    }else{
        console.log("Already connected to database");
        if(typeof callback === 'function'){
            callback(null, db);
        }
    }
}

function closeConnection(callback){
    db.close();
    db = null;
    if(typeof callback === 'function'){
        callback();
    }
}

// check if a user with a particular username exists in the database
function checkUser(userName){
    return  findUser(userName)
            .then(function(user){
                return !(user===null)
            });
}

// find a single user by their user name
function findUser(userName){
    return users.find({name:userName}).limit(1).nextObject();
}

function addUser(name, dob, zip, biz, pic){

    return  checkUser(name)
            .then(function(isValid){
                if(isValid){
                    throw new Error(`user name "${name}" already in use.`);
                }else{
                    return users.insertOne(
                            {   name:name,
                                dob:dob, 
                                zip:zip, 
                                biz:biz, 
                                pic:pic, 
                                followedBy:[name], 
                                followedPosts:[], 
                                messages:[], 
                                posts:[]});
                }
            });
}

function getUsers(filter, callback){
    var users = db.collection('users');
    if(typeof callback === 'function'){
        return users.find(filter, callback);
    }else{
        return users.find(filter);
    } 
}

function followUser(followeeName, followerName, callback){
    var users = db.collection('users');

    if(!callback instanceof Function){
        callback = function(err, r){
            assert.equal(null, err);
        }
    }


    return users.find({name: followeeName}).limit(1).next(
        function(err, doc){
            console.log(err)

            var followedBy;
            if(doc.followedBy instanceof Array){
                followedBy = doc.followedBy;
            }else{
                followedBy = [];
            }
            followedBy.push(followerName);

            // update the list of followees
            users.updateOne({name: followeeName}, {$set:{followedBy: followedBy}}, callback)
        })
}

function sendMessage(){

}


// add a post
function addPost(poster, content, recipient){

    // message is private by default public
    recipient = recipient || null;

    var users = db.collection('users');
    var posts = db.collection('posts');
    var newPostIdx;

    // count the number of posts already available
    return posts.count()
    // insert the new post to the collection of posts, using the count as the idx to identify it
    .then(function(idx){
        newPostIdx = idx;
        return posts.insertOne({idx:newPostIdx, poster:poster, content:content})
    })
    // notify the recipients
    .then(function(cursor){
        if(recipient){
            // if it is private, notify just the recipient
            return  users.find({name: recipient}).limit(1).nextObject()
                    .then(function(doc){
                        return notifyRecipient(doc, newPostIdx);
                    })

        }else{
            // if it is not a private message, get all followers and notify them of the new post
            return  users.find({name: poster}).limit(1).nextObject()
                    .then(function(doc){
                        return notifyFollowers(doc, newPostIdx);
                    })
        }

    })
}

/// notify the message recipient of the new message
function notifyRecipient(doc, newPostIdx){
    return  ensureProperty(doc,"messages",[])
            .then(function(doc){
                var messages = doc.messages;
                messages = messages.unshift(newPostIdx);
                return users.updateOne({name:doc.name}, {$set: {messages: messages}})
            })
}

// notify all followers of the new post
function notifyFollowers(doc, newPostIdx){
    return  ensureProperty(doc, "followedBy", [doc.name])
            .then(function(doc){
                var followedBy = doc.followedBy;
                return Promise.all(followedBy.map(createUpdater(newPostIdx)));
            })
}


// strategy to update a follower of a new post
function createUpdater(newPostIdx){
    return function(followerName){
        var users = db.collection('users');

        return  users.find({name: followerName}).limit(1).nextObject()
                .then(function(doc){
                    return ensureProperty(doc,"followedPosts",[]);
                })
                .then(function(doc){
                    var followedPosts = doc.followedPosts;
                    followedPosts.unshift(newPostIdx);
                    users.updateOne({name: doc.name}, {$set: {followedPosts: followedPosts}});
                })
    }
}

// ensure that a document has a property and set it to a defaultValue if not
function ensureProperty(doc, property, defaultValue){
    if(typeof doc[property] === 'undefined'){
        return users.updateOne({name: doc.name},{$set: {property: defaultValue}});
    }else{
        return Promise.resolve(doc);
    }
}


function addPremium(){

}

function getFollowedPosts(userName){
    var users = db.collection('users');
    var posts = db.collection('posts');

    return  users.find({name: userName}).limit(1).nextObject()
            .then(function(userDoc){
                return userDoc.followedPosts || [];
            })
            .then(function(followedPostIdxs){
                var nFollowedPosts = followedPostIdxs.length;
                var postDataPromises = [];
                for(var idx=0; idx<nFollowedPosts; idx++){
                    var postIdx = followedPostIdxs[idx];
                    var postDataPromise =   posts.find({idx: postIdx}).limit(1).nextObject()
                                            .then(function(postDoc){
                                                return postDoc;
                                            })
                    postDataPromises.push(postDataPromise)
                }
                return Promise.all(postDataPromises);           
            })
}

module.exports = {
    connect: connect, 
    closeConnection: closeConnection,
    checkUser: checkUser,
    addUser: addUser,
    getUsers: getUsers,
    addPost: addPost,
    addPremium: addPremium,
    followUser: followUser,
    getFollowedPosts: getFollowedPosts
};