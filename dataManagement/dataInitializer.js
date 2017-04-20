module.exports.user = function(name, dob, zip, biz, pic){
    return {name:name,
            dob:dob, 
            zip:zip, 
            biz:biz, 
            pic:pic, 
            followedBy:[name], 
            followedPosts:[], 
            messages:[], 
            posts:[]};
}

module.exports.post = function(idx, poster, content){
    return {idx:idx,
            poster: poster, 
            content:content};
}
