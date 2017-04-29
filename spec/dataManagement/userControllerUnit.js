const databaseManagerPath = '../mock/databaseManager';
const UserControllerBaseSpec = require('./userControllerBase');

var testCase = new UserControllerBaseSpec(databaseManagerPath);
testCase.runTests();