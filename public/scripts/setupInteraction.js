define(
    [   'jquery', 
        '/scripts/followUser.js',
        '/scripts/submitPost.js'],
    function($, followUser, submitPost){
            
        return function(otherUserName){

                var followBtn = $('#followBtn');
                followBtn.click(function(){
                    followUser(
                        otherUserName, 
                        function(){
                            alert("Updated following list!");
                        })
                })

                var sendMessageBtn = $('#sendMessage');
                var messageTextarea = $('#messageTextarea');
                sendMessageBtn.click(function(){
                    var message = messageTextarea.val();
                    submitPost(
                        message,
                        otherUserName, 
                        function(){
                            messageTextarea.val("");
                            alert("Message Sent!");
                        })
                })            
            };
    })