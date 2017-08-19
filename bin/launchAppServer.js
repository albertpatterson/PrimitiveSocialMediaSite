// create the databaseManager
const DatabaseManager = require('../dataManagement/DatabaseManager');
const dbUrl = require('../../../../private/socialMediaDatabasePrivateURL');
const databaseManager = new DatabaseManager(dbUrl);

// create the userController
const UserController = require('../dataManagement/UserController');
const userController = new UserController(databaseManager);

// create the app 
const appFactory = require('../appFactory');
const app = appFactory(userController);

const launchServer = require('../tools/launchServer');
launchServer(app);


// const path = require('path');

// const databaseUrl = process.argv[2] || require('../../../../private/socialMediaDatabasePrivateTestURL');
// // const launchServer = require('../tools/launchServer');

// const appFactory = process.argv[3]?require(path.join('..',process.argv[3])):require('../app');

// const UserController = require('../dataManagement/UserController');
// const DatabaseManager = require('../dataManagement/DatabaseManager');
// const userController = new UserController(new DatabaseManager(databaseUrl));
// const app = appFactory(userController);

// const ServerManager = require('../tools/ServerManager');
// const serverManager = new ServerManager(app);
// serverManager.listen();

// launchServer(app);

// setInterval(()=>console.log(Date.now()), 1000)