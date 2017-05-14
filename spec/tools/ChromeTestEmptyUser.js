const BrowserTest = require('./BrowserTest');
const BrowserLauncher = require('./BrowserLauncher');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const defaultChromeLocation = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const defaultProcessArgs =  [   '--incognito',
                                '--bwsi',
                                '--allow-insecure-localhost',
                                '--disable-web-security',
                                '--disable-popup-blocking'
                            ];

class ChromeTestEmptyUser extends BrowserTest{
    constructor(specPath, beforeFcn, afterFcn){
        const specUrl = BrowserTest.getSpecUrl(specPath);
        const chromeLauncher = new BrowserLauncher(defaultChromeLocation, defaultProcessArgs, specUrl)
        super(chromeLauncher, beforeFcn, afterFcn);
    }

    runTest(){
        const runTest = super.runTest.bind(this);
        let userDataDir;
        return  setupTempUserDir()
                .then(function(newUserDataDir){
                    userDataDir = newUserDataDir;
                    this.browserLauncher.processArgs.push (`--user-data-dir=${userDataDir}`);
                    if(userDataDir) return runTest()
                }.bind(this))
                .then(function(){
                    return clearTempUserDir(userDataDir);
                })
                .catch(function(err){
                    console.log(err)
                }.bind(this))                   
    }
}

// temporary location to store generated user data
const userDataBaseDir = 'C:\\Users\\apatters\\Documents\\junk\\temp';
var count = 0;

/**
 * setup a temporary user directory
 * 
 * @param {Function} callback to execute once the director is setup
 * @returns {Function} teardown function to remove the temporary directory
 */
function setupTempUserDir(){
    const userDataDir = path.join(userDataBaseDir, (count++).toString());
    return  clearTempUserDir(userDataDir)
            .then(function(){
                return createTempUserDir(userDataDir);
            }.bind(this))
            .then(function(){
                return userDataDir;
            }.bind(this))
            .catch(function(err){
                console.log(`Error setting up userDataDir: ${err}`)
            }.bind(this))    
}

function createTempUserDir(userDataDir){
    return new Promise((res, rej)=>fs.mkdir(userDataDir, err=>err?rej(err):res()));
}

function clearTempUserDir(userDataDir){
    return new Promise((res, rej)=>rimraf(userDataDir, err=>err?rej(err):res()));
}

module.exports = ChromeTestEmptyUser;