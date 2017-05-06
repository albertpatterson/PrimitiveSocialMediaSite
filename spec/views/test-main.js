requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',

    // ask Require.js to load these files (all our tests)
    deps: [
        'spec/views/testSpec.js'
    ],

    // start test run, once Require.js is done
    callback: window.__karma__.start
});