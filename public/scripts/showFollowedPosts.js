define(
    [   'jquery',
        'insertPost'],
    function($, insertPost){

        return function(parent, followdPosts){            
                var nPosts = followdPosts.length;
                
                // display the latest posts
                var fragment = $(document.createDocumentFragment());

                // append each post to the fragment
                for(var idx=0; idx<nPosts; idx++){
                    var post = followdPosts[idx];
                    insertPost(post.poster, post.content, fragment, 'append');
                }
                // append the fragment to the page
                $(parent).append(fragment);
        };
    })

