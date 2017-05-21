const cp = require('child_process');

class ChildProcessManager{
    constructor(mainFcnPath, dependencies){
        this.mainFcnPath = mainFcnPath;
        this.dependencies = dependencies;
    }

    launch(){
        this.childProcess = cp.fork(this.mainFcnPath, this.dependencies, {execArgv: ['--debug=5899']});
        return Promise.resolve();
    }

    kill(){
        this.childProcess.kill();
        console.log('Child process killed');
        return Promise.resolve();
    }

    on(eventName, callback){
        return this.childProcess.on(eventName, callback);
    }

    once(eventName, callback){
        return this.childProcess.once(eventName, callback);
    }

    removeAllListeners(eventName){
        return this.childProcess.removeAllListeners(eventName);
    }
}

module.exports = ChildProcessManager;