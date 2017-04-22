/**
 * controls interaction with the database to update users and their posts
 *
 * @module userController
 */

class UserController{
    constructor(dbm){
        this.databaseManager = dbm || require("./databaseManager")();
    }
    

    /**
     * add a user to the database, after checking that the user does not already exist
     * 
     * @param {String} name the name of the user to add
     * @param {String} dob the user's data of birth
     * @param {Number} zip the user's zip code
     * @param {String} biz the uers's business 
     * @param {String} pic the path to the user's picture
     * @returns {Promise} promise that will be resolved once the database is updated
     */
    addUser(name, dob, zip, biz, pic){
        return  this.databaseManager.checkUser(name)
                .then(function(isValid){
                    if(isValid){
                        throw new Error(`user name "${name}" already in use.`);
                    }else{
                        return this.databaseManager.insertUser(name, dob, zip, biz, pic);
                    }
                }.bind(this))
                .then(function(){
                    return;
                });
    } 


    /**
     * get a user's informtion from the database
     * 
     * @param {String} userName the name of the user whose information is required
     * @returns {Promise} promise that will be resolved with the user's information
     */
    getUser(userName){
        return this.databaseManager.findUser(userName);
    } 


    /**
     * check if a user currently exists in the database
     * 
     * @param {String} userName the name of the user
     * @returns {Promise} promise that will be resolved with a Boolean indicating if the user exists
     */
    checkUser(userName){
        return this.databaseManager.checkUser(userName);
    }


    /**
     * follow a user
     * 
     * @param {string} followeeName the name of the user being followed
     * @param {string} followerName the name of the following user
     * @returns {Promise} promise that will be resolved once the update is completed in the database
     */
    followUser(followeeName, followerName){
                // find the followee in the database
        return  this.databaseManager.findUser(followeeName)
                // ensure that the user has a "followedBy" property
                .then(function(doc){
                    return this.databaseManager.ensureProperty(doc, "followedBy", [followeeName])
                }.bind(this))
                // update the followee's list of followers
                .then(function(doc){
                    var followedBy = doc.followedBy;
                    followedBy.push(followerName);
                    return this.databaseManager.updateUser(followeeName, "followedBy", followedBy)
                }.bind(this));     
    }

    /**
     * add a post
     * 
     * @param {String} poster the name of the user adding the post
     * @param {String} content the constent of the post
     * @param {String} [recipient] the recipient of a private pose
     * @returns {Promise} promise that will be resolved once the post is added to the database and followers/recipient is notified
     */
    addPost(poster, content, recipient){

        // message is private by default
        recipient = recipient || null;

        // index of the new post
        var newPostIdx;

        // count the number of posts already available
        return this.databaseManager.countPosts()
        // insert the new post to the collection of posts, using the count as the idx to identify it
        .then(function(idx){
            newPostIdx = idx;
            return this.databaseManager.insertPost(idx, poster, content)
        }.bind(this))
        // notify the followers or recipients
        .then(function(){
            if(recipient){
                // if it is private, notify just the recipient
                return  this.databaseManager.findUser(recipient)
                        .then(function(doc){
                            return this._notifyRecipient(doc, newPostIdx);
                        }.bind(this));

            }else{
                // if it is not a private message, get all followers and notify them of the new post
                return  this.databaseManager.findUser(poster)
                        .then(function(doc){
                            return this._notifyFollowers(doc, newPostIdx);
                        }.bind(this));
            }

        }.bind(this));
    }

    /**
     * notify the message recipient of the new message
     * 
     * @private
     * @param {Object} doc the object representing the document of the recipient in the database
     * @param {Number} newPostIdx the index of the post
     * @returns {Promise} promise that will be resolved once the recipient is updated
     */
    _notifyRecipient(doc, newPostIdx){
                // ensure that the recipient has a "messages" property
        return  this.databaseManager.ensureProperty(doc, "messages", [])
                // add the new post to the recipient's messages
                .then(function(doc){
                    var messages = doc.messages;
                    messages = messages.unshift(newPostIdx);
                    return this.databaseManager.updateUser(doc.name, "messages", messages);
                }.bind(this));
    }

    /**
     * notify all followers of the new post
     * 
     * @private
     * @param {Object} doc the object representing the document of poster in the database
     * @param {Number} newPostIdx the index of the post
     * @returns {Promise} promise that will be resolved once all followers are updated
     */
    _notifyFollowers(doc, newPostIdx){
                // ensure that the poster has a "folloedBy" property
        return  this.databaseManager.ensureProperty(doc, "followedBy", [doc.name])
                // update all followers of the new post
                .then(function(doc){
                    var followedBy = doc.followedBy;
                    return Promise.all(followedBy.map(followerName => this._updateFollower(followerName, newPostIdx)));
                }.bind(this));
    }

    /**
     * notify a follower of a new post
     * 
     * @private
     * @param {String} followerName the name of the following user
     * @param {Number} newPostIdx the index of the new post
     * @returns {Promise} promise to be resolved when the follower is updated
     */
    _updateFollower(followerName, newPostIdx){
                // find the follower
        return  this.databaseManager.findUser(followerName)
                // ensure that the follower has a "followedPosts" property
                .then(function(doc){
                    return this.databaseManager.ensureProperty(doc, "followedPosts", []);
                }.bind(this))
                // prepend the index of the new post to the followed posts
                .then(function(doc){
                    var followedPosts = doc.followedPosts;
                    followedPosts.unshift(newPostIdx);
                    return this.databaseManager.updateUser(doc.name, "followedPosts", followedPosts);
                }.bind(this));
    }

    addPremium(){

    }

    /**
     * get the content of a user's followed posts
     * 
     * @param {String} userName the name of the user whose followed posts are required
     * @returns {Promise} promise that will be resolved with the array of followed posts 
     */
    getFollowedPosts(userName){
                // find the user
        return  this.databaseManager.findUser(userName)
                // ensure that the user has a "followedPosts" property
                .then(function(doc){
                    return this.databaseManager.ensureProperty(doc, "followedPosts", []);
                }.bind(this))
                // get the content of each of the followed posts
                .then(function(doc){
                    var followedPostIdxs = doc.followedPosts;
                    var nFollowedPosts = followedPostIdxs.length;
                    var postDataPromises = [];
                    for(var idx=0; idx<nFollowedPosts; idx++){
                        var postIdx = followedPostIdxs[idx];
                        var postDataPromise =  this.databaseManager.findPost(postIdx);
                        postDataPromises.push(postDataPromise);
                    }
                    return Promise.all(postDataPromises);           
                }.bind(this));
    }

    /**
     * perform an action for each user in a set that matches a query
     * 
     * @param {Object} query the query object to select a subset of users
     * @param {Function} iterCallback the function to execute on each of the users who match the query
     * @returns {Promise} promise that will be resolved when all iterations are complete
     */
    forEachUser(query, iterCallback){
        var matches = this.databaseManager.findUsers(query);
        return new Promise(function(resolve, reject){
            matches.forEach(
                iterCallback,
                function(err){
                    if(err===null){
                        resolve();
                    }else{
                        reject(err);
                    }
                }.bind(this));
        });
    }
}

var defaultInstance = new UserController();
module.exports = {
    instance: defaultInstance,
    UserControllerClassdef: UserController
}
        
//     // reveal a subset of methods
//     return {
//         addUser: addUser,
//         getUser: getUser,
//         checkUser: checkUser,
//         followUser: followUser,
//         addPost: addPost,
//         addPremium: addPremium,
//         getFollowedPosts: getFollowedPosts,
//         forEachUser: forEachUser
//     };
// }