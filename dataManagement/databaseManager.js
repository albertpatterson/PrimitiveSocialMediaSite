const MongoClient = require('mongodb').MongoClient;
const url = require("../../../../private/socialMediaDatabasePrivateURL");
const dataInitializer = require("./dataInitializer");
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
                return !(user===null);
            });
}

// find a single user by their user name
function findUser(userName){
    return users.find({name:userName}).limit(1).nextObject();
}

function findUsers(filter){
    return users.find(filter);
}

// insert a user
function insertUser(name, dob, zip, biz, pic){

    return  checkUser(name)
            .then(function(isValid){
                if(isValid){
                    throw new Error(`user name "${name}" already in use.`);
                }else{
                    return users.insertOne(dataInitializer.user(name, dob, zip, biz, pic))
                }
            });
}

// update a user
function updateUser(name, property, newValue){
    var update={};
    update[property]=newValue;
    users.updateOne({name:name}, {$set:update});
}

// find a single user by their user name
function findPost(idx){
    return posts.find({idx:idx}).limit(1).nextObject();
}

// insert a post
function insertPost(idx, poster, content){
    return posts.insertOne(dataInitializer.post(idx, poster, content));
}

function countPosts(){
    return posts.count();
}

// ensure that a document has a property and set it to a defaultValue if not
function ensureProperty(doc, property, defaultValue){
    if(typeof doc[property] === 'undefined'){
        return updateUser(doc.name, property, defaultValue);
    }else{
        return Promise.resolve(doc);
    }
}

module.exports = {
    connect: connect, 
    closeConnection: closeConnection,
    checkUser: checkUser,
    findUser: findUser,
    findUsers: findUsers,
    insertUser: insertUser,
    updateUser: updateUser,
    findPost: findPost,
    insertPost: insertPost,
    countPosts: countPosts,
    ensureProperty: ensureProperty
};