requirejs = {
    // to set the default folder
    baseUrl: '../../..', 
    // paths: maps ids with paths (no extension)
    paths: {
        'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min',
        
        'followUser': '/scripts/followUser',
        'insertPost': '/scripts/insertPost',
        'showFollowedPosts': '/scripts/showFollowedPosts',
        'submitPost': '/scripts/submitPost',
        
        'alignVertical': '/scripts/alignVertical',
        'setupPostSystem': '/scripts/setupPostSystem',
        'setupInteraction': '/scripts/setupInteraction'
    },
    // shim: makes external libraries compatible with requirejs (AMD)
    shim: {
    }
};