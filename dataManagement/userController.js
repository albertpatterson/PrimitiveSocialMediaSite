var databaseManager;

// follow a user
function followUser(followeeName, followerName){

    return  databaseManager.findUser(followeeName)
            .then(function(doc){
                return databaseManager.ensureProperty(doc, "followedBy", [followeeName])
            })
            .then(function(doc){
                var followedBy = doc.followedBy;
                followedBy.push(followerName);
                return databaseManager.updateUser(followeeName, "followedBy", followedBy)
            });     
}

// add a post
function addPost(poster, content, recipient){

    // message is private by default public
    recipient = recipient || null;

    var newPostIdx;

    // count the number of posts already available
    return databaseManager.countPosts()
    // insert the new post to the collection of posts, using the count as the idx to identify it
    .then(function(idx){
        newPostIdx = idx;
        return databaseManager.insertPost(idx, poster, content)
    })
    // notify the recipients
    .then(function(){
        if(recipient){
            // if it is private, notify just the recipient
            return  databaseManager.findUser(recipient)
                    .then(function(doc){
                        return notifyRecipient(doc, newPostIdx);
                    });

        }else{
            // if it is not a private message, get all followers and notify them of the new post
            return  databaseManager.findUser(poster)
                    .then(function(doc){
                        return notifyFollowers(doc, newPostIdx);
                    });
        }

    });
}

/// notify the message recipient of the new message
function notifyRecipient(doc, newPostIdx){
    return  databaseManager.ensureProperty(doc, "messages", [])
            .then(function(doc){
                var messages = doc.messages;
                messages = messages.unshift(newPostIdx);
                return databaseManager.updateUser(doc.name, "messages", messages);
            });
}

// notify all followers of the new post
function notifyFollowers(doc, newPostIdx){
    return  databaseManager.ensureProperty(doc, "followedBy", [doc.name])
            .then(function(doc){
                var followedBy = doc.followedBy;
                return Promise.all(followedBy.map(createUpdater(newPostIdx)));
            });
}

// strategy to update a follower of a new post
function createUpdater(newPostIdx){
    return function(followerName){
        return  databaseManager.findUser(followerName)
                .then(function(doc){
                    return databaseManager.ensureProperty(doc, "followedPosts", []);
                })
                .then(function(doc){
                    var followedPosts = doc.followedPosts;
                    followedPosts.unshift(newPostIdx);
                    return databaseManager.updateUser(doc.name, "followedPosts", followedPosts);
                });
    };
}

function addPremium(){

}

// get the followed posts of a user
function getFollowedPosts(userName){

    return  databaseManager.findUser(userName)
            .then(function(doc){
                return databaseManager.ensureProperty(doc, "followedPosts", []);
            })
            .then(function(doc){
                var followedPostIdxs = doc.followedPosts;
                var nFollowedPosts = followedPostIdxs.length;
                var postDataPromises = [];
                for(var idx=0; idx<nFollowedPosts; idx++){
                    var postIdx = followedPostIdxs[idx];
                    var postDataPromise =  databaseManager.findPost(postIdx);
                    postDataPromises.push(postDataPromise);
                }
                return Promise.all(postDataPromises);           
            });
}

// perform an action for each user in a set that matches a query
function forEachUser(query, iterCallback){
    var matches = databaseManager.findUsers(query);
    return new Promise(function(resolve, reject){
        matches.forEach(
            iterCallback,
            function(err){
                if(err===null){
                    resolve();
                }else{
                    reject(err);
                }
            });
    });
}

module.exports = function(dbm){
    databaseManager = dbm || require("./databaseManager");
        
    return {
        addUser: databaseManager.insertUser,
        getUser: databaseManager.findUser,
        checkUser: databaseManager.checkUser,
        followUser: followUser,
        addPost: addPost,
        addPremium: addPremium,
        getFollowedPosts: getFollowedPosts,
        forEachUser: forEachUser
    };
}