define(['jquery'],function($){
    // append a post to some element
    return function(poster, content, parent, method){
        // var fragment = $(document.createDocumentFragment());
        var container = $('<div></div>')
                        .addClass('postContainer')
                        .addClass('row');
        
        // var posterName = $(document.createElement('p'));
        // posterName.text(poster||"unknown");
        // posterName.css({"text-align":"center", "margin-top":"10px", "margin-bottom":"0px", "font-size":"25px", "font-weight":"bold"});
        
        var posterName = $('<p></p>')
            .addClass('posterName')
            .text(poster||"unknown");


        // var newPostRow = $(document.createElement('div'));
        // newPostRow.addClass("row").addClass("contentItem");

        // var newPost = $(document.createElement('div'));
        // newPost.css("width", "90%");
        // newPost.css("margin", "auto");
        // newPost.css('overflow', 'hidden');

        // var newPostText = $(document.createElement('p'));        
        // newPostText.text(content);
        // newPostText.css({"margin-top":"5px", "margin-bottom":"25px","margin-right":"0px","margin-left":"0px"});

        var postContent =    $('<p></p>')
                            .addClass('postContent')
                            .text(content);

        // newPost.append(newPostText);
        // newPostRow.append(posterName);
        // newPostRow.append(newPost);

        container.append(posterName).append(postContent)

        // fragment.append($(document.createElement('br')));
        // fragment.append(newPostRow);

        $(parent)[method](container);
    }
})