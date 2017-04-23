/**
 * defines the DatbaseManagerMock class, which is used to mock out a DatabaseManager in testing
 *
 * @module databaseManager
 */

const dataInitializer = require("../../dataManagement/dataInitializer");

function filterFun(filter){
    return eval(filter);
}


/**
 * Class defining a mock DatabaseManager for use in testing
 * 
 * @class DatabaseManagerMock
 */
class DatabaseManagerMock{

    /**
     * Creates an instance of DatabaseManagerMock.
     * @param {String} [url] unused
     * 
     * @memberOf DatabaseManagerMock
     */
    constructor(url){
        this._url = url
        this._db = null;
        this._users = [];
        this._posts = [];
    }


    /**
     * find the document of a user in the database
     * 
     * @param {String} userName the name of the user whose data is required
     * @returns {Promise} promise that will be resolved with the user's document
     * 
     * @memberOf DatabaseManagerMock
     */
    findUser(userName) {
        var idx = this._getUserNameIdx(userName);
        if (idx === -1) {
            return Promise.resolve(null);
        } else {
            return Promise.resolve(this._users[idx]);
        }
    }


    /**
     * check if a user exists in the database
     * 
     * @param {Sting} userName the name of the user to check for
     * @returns {Promise} promise that will be resolved with a Boolean indicating if the user exists in the database
     * 
     * @memberOf DatabaseManagerMock
     */
    checkUser(userName) {
        return Promise.resolve(!(this._getUserNameIdx(userName) === -1));
    }

    /**
     * get the index of a user in the array of users
     * 
     * @private
     * @param {any} userName the name of the user whose index is required
     * @returns {Number} the index of the user in the array of users
     * 
     * @memberOf DatabaseManagerMock
     */
    _getUserNameIdx(userName) {
        return this._users.map(user => user.name).indexOf(userName);
    }

    // todo: consider messages

    /**
     * clear the contents of the database
     * 
     * @returns {Promise} promise that will be resolved after the database is cleared
     * 
     * @memberOf DatabaseManagerMock
     */
    clearDatabase(){
        this._users = [];
        this._posts = [];
        return Promise.resolve();
    };

    /**
     * connect to the database
     * 
     * @returns {Promise} promise that will be resolved once connection is complete
     * 
     * @memberOf DatabaseManagerMock
     */
    connect(){return Promise.resolve();}

    /**
     * close the connection to the database
     * 
     * @returns {Promise} promise that will be resolved once the connection is terminated
     * 
     * @memberOf DatabaseManagerMock
     */
    close(){return Promise.resolve();}


    /**
     * find a subset of users that match a query
     * 
     * @param {Object} filter the object defining the query
     * @returns {Object} object with a forEach method for iterating over the matching users
     * 
     * @memberOf DatabaseManagerMock
     */
    findUsers(filter){
        // get the results that match the filter
        // filter["$where"] will be a string expression that must be evaluated on each user
        var results= this._users.filter(user=>filterFun.call(user, filter["$where"]));
        // return object with forEach property to perform an action for all users that match the filer
        return {forEach: (x, y)=>{results.forEach(x); y(null);}};
    };


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
     * @memberOf DatabaseManagerMock
     */
    insertUser(name, dob, zip, biz, pic){
        return  this.checkUser(name)
                .then(function(isTaken){
                    if (isTaken) {
                        return Promise.reject(`user name ${name} already in use`);
                    } else {
                        var newUser = dataInitializer.user(name, dob, zip, biz, pic);
                        this._users.push(newUser);
                        return Promise.resolve(newUser);
                    }        
                }.bind(this));
    };

    /**
     * update a user's document in the data base
     * 
     * @param {Sting} name the name of the user to update
     * @param {String} property the property in the document to update
     * @param {any} newValue the value to store in the document
     * @returns {Promise} promise that will be resolved when the database is updated
     * 
     * @memberOf DatabaseManagerMock
     */
    updateUser(name, property, newValue){
        var user = this._users[this._getUserNameIdx(name)];
        user[property] = newValue;
        return Promise.resolve(user);
    };

    /**
     * count the number of user in the database
     * 
     * @returns {Promise} promise that will be resolved with the number of users
     * 
     * @memberOf DatabaseManagerMock
     */
    countUsers(){
        var userCount = this._users.length;
        return Promise.resolve(userCount);
    }

    /**
     * find a post in the database
     * 
     * @param {Number} idx the index of the post
     * @returns {Promise} promise that will be resolved with the document of the post
     * 
     * @memberOf DatabaseManagerMock
     */
    findPost(idx){
        var post = this._posts[idx];
        return Promise.resolve(post);
    };

    /**
     * insert a post into the database
     * 
     * @param {Number} idx the index to assign to the post
     * @param {String} poster the name of the user who created the post
     * @param {String} content the content to include in the post
     * @returns {Promise} promise that will be resolved when the database is updated
     * 
     * @memberOf DatabaseManagerMock
     */
    insertPost(idx, poster, content){
        var newPost = dataInitializer.post(idx, poster, content)
        this._posts.push(newPost);
        return Promise.resolve(newPost);
    };

    /**
     * count the number of posts in the database
     * 
     * @returns {Promise} promise that will be resolved with the number of posts in the database
     * 
     * @memberOf DatabaseManagerMock
     */
    countPosts(){
        return Promise.resolve(this._posts.length);
    };

    /**
     * ensure that a document has a property, and update the document with a default value if not
     * 
     * @param {Object} doc Object representing the document
     * @param {String} property the name of the property
     * @param {any} defaultValue the default value of the property
     * @returns {Promise} promise that will be resolved with the updated document
     * 
     * @memberOf DatabaseManagerMock
     */
    ensureProperty(doc, property, defaultValue){
        if(!(doc[property])){
            doc[property]=defaultValue;
        }
        return Promise.resolve(doc);
    };

}

module.exports = DatabaseManagerMock;