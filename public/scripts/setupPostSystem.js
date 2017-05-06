define(
    [  'jquery', 
        'showFollowedPosts',
        'submitPost',
        'insertPost'],
    function($, showFollowedPosts, submitPost, insertPost){
        return function(latestPosts){
            // show the user's followed posts
            showFollowedPosts('#followedPosts', latestPosts);

            // set the click event for the button to add a post
            $("#submitPost").click(function(){
                var content = $("#postContainer").val();
                submitPost(
                    content, 
                    null, 
                    function(poster){
                        // clear the text area
                        $("#postContainer").val("");
                        // append the post to the document
                        insertPost(poster, content, "#followedPosts", 'prepend');
                    })
            })
        };
})
