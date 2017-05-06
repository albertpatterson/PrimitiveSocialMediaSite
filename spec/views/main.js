// Requirejs Configuration Options
require.config({
  // to set the default folder
  baseUrl: '../..', 
  // paths: maps ids with paths (no extension)
  paths: {
    'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min',
      
    'followUser': './public/scripts/followUser',
    'insertPost': './public/scripts/insertPost',
    'showFollowedPosts': './public/scripts/showFollowedPosts',

    'jasmine': ['./spec/views/lib/jasmine-2.6.1/jasmine'],
    'jasmine-html': ['./spec/views/lib/jasmine-2.6.1/jasmine-html'],
    'jasmine-boot': ['./spec/views/lib/jasmine-2.6.1/boot'],
    
    'maskWithSpy': './spec/mock/maskWithSpy',
    'createFullSpy': './spec/mock/createFullSpy',
    'jqueryFullSpy': './spec/mock/jqueryFullSpy'

  },
  // shim: makes external libraries compatible with requirejs (AMD)
  shim: {
    'jasmine-html': {
      deps : ['jasmine']
    },
    'jasmine-boot': {
      deps : ['jasmine', 'jasmine-html']
    }
  }
});


require(['jasmine-boot'], function () {
    require(['./testSpec.js'], function(){
        //trigger Jasmine
        window.onload();
    })
});