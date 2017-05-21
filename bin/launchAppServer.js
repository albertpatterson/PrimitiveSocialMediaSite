const path = require('path');

const databaseUrl = process.argv[2] || require('../../../../private/socialMediaDatabasePrivateTestURL');
// const launchServer = require('../tools/launchServer');

const appFactory = process.argv[3]?require(path.join('..',process.argv[3])):require('../app');

const UserController = require('../dataManagement/UserController');
const DatabaseManager = require('../dataManagement/DatabaseManager');
const userController = new UserController(new DatabaseManager(databaseUrl));
const app = appFactory(userController);

const ServerManager = require('../tools/ServerManager');
const serverManager = new ServerManager(app);
serverManager.listen();

// launchServer(app);

// setInterval(()=>console.log(Date.now()), 1000)