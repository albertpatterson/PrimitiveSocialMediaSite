const databaseManagerPath = '../mock/databaseManager';
const UserControllerBaseSpec = require('./userControllerBaseSpec');

var testCase = new UserControllerBaseSpec(databaseManagerPath);
testCase.runTests();