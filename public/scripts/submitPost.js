define(['jquery'], function($){// set the click event for the button to add a post
// define([], function(){// set the click event for the button to add a post
        
    return function(content, recipient, callback){
        if(content){
            $.post(
                "/signedIn/ajax/postContent", 
                {content: content, recipient},
                function(poster){
                    if(typeof callback === 'function') callback(poster);
                })
        }
    }
})