const databaseManagerPath = '../../dataManagement/databaseManager';
const databaseManagerTestUrl = require("../../../../../private/socialMediaDatabasePrivateTestURL");
const UserControllerBaseSpec = require('./userControllerBase');

var testCase = new UserControllerBaseSpec(databaseManagerPath, databaseManagerTestUrl);
testCase.runTests();