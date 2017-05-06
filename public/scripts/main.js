// Requirejs Configuration Options
require.config({
  // to set the default folder
  baseUrl: '../..', 
  // paths: maps ids with paths (no extension)
  paths: {
    'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min',
      
    'followUser': './public/scripts/followUser',
    'insertPost': './public/scripts/insertPost',
    'showFollowedPosts': './public/scripts/showFollowedPosts'
  },
  // shim: makes external libraries compatible with requirejs (AMD)
  shim: {
  }
});