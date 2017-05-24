const BrowserTester = require('./BrowserTester');
const chromeExePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const userDataBaseDir = 'C:\\Users\\apatters\\Documents\\junk\\temp\\Chrome';
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');
const checkExist = require('../../../tools/checkExist');
/**
 * tester of the chrome browser
 * 
 * @class ChromeTester
 * @extends {BrowserTester}
 */
class ChromeTester extends BrowserTester{
    /**
     * Creates an instance of ChromeTester.
     * @param {String[]} processArgs arguments to supply when spawning the chrome process
     * 
     * @memberOf ChromeTester
     */
    constructor(processArgs){
        super(chromeExePath, processArgs);
    }

    /**
     * get a user data dir for use with testing in chrome
     * 
     * @static
     * @param {any} basename 
     * @returns {Promise} resolved when the directory is found (if it exists) or a new one is created
     * 
     * @memberof ChromeTester
     */
    static getUserDataDir(basename){
        const dirPath = path.join(userDataBaseDir, basename.toString());
        return  checkExist(dirPath)
                .then(function(exists){
                    if(!exists){
                        return  new Promise(function(res, rej){
                                    fs.mkdir(dirPath,err=>err?rej(err):res(dirPath));
                                })
                    }else{
                        return dirPath;
                    }
                }.bind(this))
                .catch(function(err){
                    console.log(err)
                });

    }

    /**
     * remove a user data dir from the file system
     * 
     * @static
     * @param {any} basename 
     * @returns {Promise} resolved when the directory is removed
     * 
     * @memberof ChromeTester
     */
    static removeUserDataDir(basename){
        const dirPath = path.join(userDataBaseDir, basename.toString());
        return  checkExist(dirPath)
                .then(function(exists){
                    if(exists){
                        return  new Promise(function(res, rej){
                                    rimraf(dirPath,err=>err?rej(err):res());
                                })
                    }
                }.bind(this))
                .catch(function(err){
                    console.log(err)
                });
    }
}

module.exports = ChromeTester;