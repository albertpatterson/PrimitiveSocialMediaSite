const dataInitializer = require("../../dataManagement/dataInitializer");

var users = {};
        
var posts = {};

//function initDatabase(){
//    users = [   dataInitializer.user("Peter Griffin", "2000 01 01", 111111, "Peter's Biz",  "Peter's picture"),
//                    dataInitializer.user("Sam", "1992 11 02",  123456, "Sam's Biz", "Sam's picture"),
//                    dataInitializer.user("Jill", "1990 05 15", 098765, "Jill's Biz", "Jill's picture" ),
//                    dataInitializer.user("Anna Takabuchi", "1977 09 25", "Anna's Biz", 666666, "Anna's picture" )
//                ];
//
//    posts = [   dataInitializer.post(0, "Peter Griffin", "Peter Griffin post 1"),
//                    dataInitializer.post(1, "Jill", "Jill post 1"),
//                    dataInitializer.post(2, "Peter Griffin", "Peter Griffin post 2"),
//                    dataInitializer.post(3, "Sam", "Sam post 1")
//                ];
//
//            // assume peter follows Jill and Sam follows Peter
//    return  findUser("Jill")
//            .then(function(jillDoc){
//                // add peter tp jills followers
//                jillDoc.followedBy.push("Peter Griffin");
//                // notify peter of jill's posts
//                return findUser("Peter Griffin");
//            })
//            .then(function(peterDoc){
//                peterDoc.followedPosts.push(1);
//                // add sam to peter's followers
//                peterDoc.followedBy.push("Sam");
//                return findUser("Sam");
//            })
//            .then(function (samDoc) {
//                // notify sam of peter's posts
//                samDoc.followedPosts.push(0, 2);
//                // update the users and posts that are exported
//                module.exports.users = users;
//                module.exports.posts = posts;
//            });
//}

// module.exports.users = users;
// module.exports.posts = posts;


function findUser(userName) {
    var idx = getUserNameIdx(userName);
    if (idx === -1) {
        return Promise.resolve(null);
    } else {
        return Promise.resolve(users[idx]);
    }
}

function checkUser(userName) {
    return Promise.resolve(!(getUserNameIdx(userName) === -1));
}

function getUserNameIdx(userName) {
    return users.map(user => user.name).indexOf(userName);
}

// todo: consider messages

function clearDatabase(){
    users = [];
    posts = [];
    return Promise.resolve();
};

var connect = ()=>Promise.resolve();

var close = ()=>Promise.resolve();


function findUsers(filter){
    var results= users.filter(user=>filter(user));
    return {forEach: (x, y)=>{results.forEach(x); y(null);}};
};

function insertUser(name, dob, zip, biz, pic){
    return  checkUser(name)
            .then(function(isTaken){
                if (isTaken) {
                    return Promise.reject(`user name ${name} already in use`);
                } else {
                    var newUser = dataInitializer.user(name, dob, zip, biz, pic);
                    users.push(newUser);
                    return Promise.resolve(newUser);
                }        
            });
};

function updateUser(name, property, newValue){
    var user = users[getUserNameIdx(name)];
    user[property] = newValue;
    return Promise.resolve(user);
};

function findPost(idx){
    return Promise.resolve(posts[idx]);
};

function insertPost(idx, poster, content){
    var newPost = dataInitializer.post(idx, poster, content)
    posts.push(newPost);
    return Promise.resolve(newPost);
};

function countPosts(){
    return Promise.resolve(posts.length);
};

function ensureProperty(doc, property, defaultValue){
    if(!(doc[property])){
        doc[property]=defaultValue;
    }
    return Promise.resolve(doc);
};

module.exports = function(){
    return {
        connect: connect, 
        close: close,
        clearDatabase: clearDatabase,
        checkUser: checkUser,
        findUser: findUser,
        findUsers: findUsers,
        insertUser: insertUser,
        updateUser: updateUser,
        findPost: findPost,
        insertPost: insertPost,
        countPosts: countPosts,
        ensureProperty: ensureProperty 
    }
}