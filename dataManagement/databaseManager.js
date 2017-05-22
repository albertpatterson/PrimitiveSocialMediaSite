/**
 * defines the DatbaseManager class, which update and query the database
 *
 * @module databaseManager
 */

// client for interacting with the MongoDB database
const MongoClient = require('mongodb').MongoClient;

// obect with methods for intializing users and posts with the appropriate schema
const dataInitializer = require("./dataInitializer");

var assert = require('assert');


/**
 * class defining the database manager, which updates and queries the database
 * 
 * @class DatabaseManager
 */
class DatabaseManager{

    /**
     * Creates an instance of DatabaseManager.
     * @param {String} url the url of the remote database
     * 
     * @memberOf DatabaseManager
     */
    constructor(url){
        this._url = url
        this._db = null;
        this._users = null;
        this._posts = null;
    }

    /**
     * connect to the database
     * 
     * @returns {Promise} promise that will be resolved once connection is complete
     * 
     * @memberOf DatabaseManager
     */
    connectToDatabase(){
        return new Promise(function(resolve, reject){
            if(this._db===null){
                MongoClient.connect(this._url, function(err, connectedDd){
                    assert.equal(null, err);
                    console.log(`Newly connected to database: ${this._url}`);
                    this._db = connectedDd;

                    this._users = this._db.collection('users');
                    this._posts = this._db.collection('posts');

                    resolve();
                }.bind(this))
            }else{
                console.log("Already connected to database");
                resolve();
            }
        }.bind(this))
    }

    /**
     * close the connection to the database
     * 
     * @returns {Promise} promise that will be resolved once the connection is terminated
     * 
     * @memberOf DatabaseManager
     */
    closeDatabaseConnection(){
        return new Promise(function(resolve, reject){
            this._db.close(function(){
                resolve();
                this._db = null;
            }.bind(this))
        }.bind(this))
    }

    /**
     * clear the contents of the database, but only if the url points to the test database
     * 
     * @returns {Promise} promise that will be resolved after the database is cleared
     * 
     * @memberOf DatabaseManager
     */
    clearDatabase(){
        // if(this._url === require("../../../../private/socialMediaDatabasePrivateTestURL")){
            return  this._users.deleteMany()
                    .then(function(){
                        return this._posts.deleteMany();
                    }.bind(this))
                    .then(function(){
                        this._users = this._db.collection('users');
                        this._posts = this._db.collection('posts');
                    }.bind(this))
        // }else{
        //     return Promise.reject("Not connected to the test database");
        // }
    }

    /**
     * check if a user exists in the database
     * 
     * @param {Sting} userName the name of the user to check for
     * @returns {Promise} promise that will be resolved with a Boolean indicating if the user exists in the database
     * 
     * @memberOf DatabaseManager
     */
    checkUser(userName){
        return  this.findUser(userName)
                .then(function(user){
                    return !(user===null);
                });
    }

    /**
     * find the document of a user in the database
     * 
     * @param {String} userName the name of the user whose data is required
     * @returns {Promise} promise that will be resolved with the user's document
     * 
     * @memberOf DatabaseManager
     */
    findUser(userName){
        return this._users.find({name:userName}).limit(1).nextObject();
    }

    /**
     * find a subset of users that match a query
     * 
     * @param {Object} filter the object defining the query
     * @returns {Object} object with a forEach method for iterating over the matching users
     * 
     * @memberOf DatabaseManager
     */
    findUsers(filter){
        return this._users.find(filter);
    }

    /**
     * insert a user into the database
     * 
     * @param {String} name the name of the user
     * @param {String} dob date of birth
     * @param {Number} zip zip code
     * @param {String} biz Business of the user
     * @param {String} pic Path to the user's photo
     * @returns {Promise} promose that will be resolved when the database is updated
     * 
     * @memberOf DatabaseManager
     */
    insertUser(name, dob, zip, biz, pic){

        var newUser = dataInitializer.user(name, dob, zip, biz, pic);
        return this._users.insertOne(newUser);
    }

    // update a user
    /**
     * update a user's document in the data base
     * 
     * @param {Sting} name the name of the user to update
     * @param {String} property the property in the document to update
     * @param {any} newValue the value to store in the document
     * @returns {Promise} promise that will be resolved when the database is updated
     * 
     * @memberOf DatabaseManager
     */
    updateUser(name, property, newValue){
        var update={};
        update[property]=newValue;
        return this._users.updateOne({name:name}, {$set:update}).then(()=>{});;
    }

    /**
     * count the number of user in the database
     * 
     * @returns {Promise} promise that will be resolved with the number of users
     * 
     * @memberOf DatabaseManager
     */
    countUsers(){
        return this._users.count();
    }

    /**
     * find a post in the database
     * 
     * @param {Number} idx the index of the post
     * @returns {Promise} promise that will be resolved with the document of the post
     * 
     * @memberOf DatabaseManager
     */
    findPost(idx){
        return this._posts.find({idx:idx}).limit(1).nextObject();
    }

    /**
     * insert a post into the database
     * 
     * @param {Number} idx the index to assign to the post
     * @param {String} poster the name of the user who created the post
     * @param {String} content the content to include in the post
     * @returns {Promise} promise that will be resolved when the database is updated
     * 
     * @memberOf DatabaseManager
     */
    insertPost(idx, poster, content){
        return this._posts.insertOne(dataInitializer.post(idx, poster, content)).then(()=>{});;
    }

    /**
     * count the number of posts in the database
     * 
     * @returns {Promise} promise that will be resolved with the number of posts in the database
     * 
     * @memberOf DatabaseManager
     */
    countPosts(){
        return this._posts.count();
    }

    /**
     * ensure that a document has a property, and update the document with a default value if not
     * 
     * @param {Object} doc Object representing the document
     * @param {String} property the name of the property
     * @param {any} defaultValue the default value of the property
     * @returns {Promise} promise that will be resolved with the updated document
     * 
     * @memberOf DatabaseManager
     */
    ensureProperty(doc, property, defaultValue){
        if(typeof doc[property] === 'undefined'){
            return updateUser(doc.name, property, defaultValue).then(()=>{});;
        }else{
            return Promise.resolve(doc);
        }
    }
}

module.exports = DatabaseManager;

