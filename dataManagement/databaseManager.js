// client for interacting with the MongoDB database
const MongoClient = require('mongodb').MongoClient;

// obect with methods for intializing users and posts with the appropriate schema
const dataInitializer = require("./dataInitializer");

var assert = require('assert');

// the url at which the remote database can be accessed
var url;

// database object
var db = null;

// the users collection
var users = null;
    

var posts = null;

function connect(){

    return new Promise(function(resolve, reject){
        if(db===null){
            MongoClient.connect(url, function(err, connectedDd){
                assert.equal(null, err);
                console.log(`Newly connected to database: ${url}`);
                db = connectedDd;

                users = db.collection('users');
                posts = db.collection('posts');

                resolve();
            })
        }else{
            console.log("Already connected to database");
            resolve();
        }
    })
}

function close(){
    return new Promise(function(resolve, reject){
        db.close(function(){
            resolve();
            db = null;
        })
    })
}

function clearDatabase(){
    if(url === require("../../../../private/socialMediaDatabasePrivateTestURL")){
        return  users.deleteMany()
                .then(function(){
                    return posts.deleteMany();
                })
                .then(function(){
                    users = db.collection('users');
                    posts = db.collection('posts');
                })
    }else{
        return Promise.reject("Not connected to the test database");
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

    var newUser = dataInitializer.user(name, dob, zip, biz, pic);
    return users.insertOne(newUser);
}

// update a user
function updateUser(name, property, newValue){
    var update={};
    update[property]=newValue;
    return users.updateOne({name:name}, {$set:update}).then(()=>{});;
}

function countUsers(){
    return users.count();
}

// find a single user by their user name
function findPost(idx){
    return posts.find({idx:idx}).limit(1).nextObject();
}

// insert a post
function insertPost(idx, poster, content){
    return posts.insertOne(dataInitializer.post(idx, poster, content)).then(()=>{});;
}

function countPosts(){
    return posts.count();
}

// ensure that a document has a property and set it to a defaultValue if not
function ensureProperty(doc, property, defaultValue){
    if(typeof doc[property] === 'undefined'){
        return updateUser(doc.name, property, defaultValue).then(()=>{});;
    }else{
        return Promise.resolve(doc);
    }
}


module.exports = function(databaseUrl){
    url = databaseUrl || require("../../../../private/socialMediaDatabasePrivateURL");
    
    return {
        connect: connect, 
        close: close,
        clearDatabase: clearDatabase,
        checkUser: checkUser,
        findUser: findUser,
        findUsers: findUsers,
        insertUser: insertUser,
        updateUser: updateUser,
        countUsers: countUsers,
        findPost: findPost,
        insertPost: insertPost,
        countPosts: countPosts,
        ensureProperty: ensureProperty
    };
};