const ChromeTestEmptyUser = require('../tools/ChromeTestEmptyUser');
const TestSuite = require('../tools/TestSuite');
const BrowserTest = require('../tools/BrowserTest');
const AppChildProcess = require('../../bin/AppChildProcess');
const DatabaseManager = require('../../dataManagement/DatabaseManager');

const testDbUrl = require('../../../../../private/socialMediaDatabasePrivateTestURL');
appChildProcess = new AppChildProcess(testDbUrl);
databaseManager = new DatabaseManager(testDbUrl);


const specPaths = ['/spec/system/runners/loginSystem.html']

function testPointSetup(){
    databaseManager.clearDatabase();
}

const specPoints = specPaths.map(
                        function(path){
                            return new ChromeTestEmptyUser(path, testPointSetup);
                    });

const specSuit = new TestSuite(specPoints);



specSuit.beforeAll = function(){
                        return  appChildProcess.launch()
                                .then(function(){
                                    return databaseManager.connect();
                                })
                                .then(()=>console.log('connected'))
                                .then(function(){
                                    return BrowserTest.beforeAll();
                                })
                                .catch(err=>console.log(err));
                    }

specSuit.afterAll = function(){
                        return  databaseManager.close()
                                .then(function(){
                                    BrowserTest.afterAll();
                                    appChildProcess.kill()
                                })
                    }

specSuit.runSequential();


