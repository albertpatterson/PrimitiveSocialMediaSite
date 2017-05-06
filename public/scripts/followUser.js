define(['jquery'], function($){// set the click event for the button to add a post
// define([], function(){// set the click event for the button to add a post
        
    return function(followeeName, callback=function(){}){
        $.get(
            '/signedIn/ajax/followUser?followeeName='+followeeName, 
            {},
            callback)
    }
})