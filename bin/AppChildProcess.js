const cp = require('child_process');
const path = require('path');

class AppChildProcess{
    constructor(databaseUrl){
        this.databaseUrl = databaseUrl;
        this.childProcess = null;
    }

    launch(){
        return new Promise(function(res, rej){
            const appLauncher = path.join(__dirname,'appChildProcessLauncher');
            this.childProcess = cp.fork(appLauncher, [this.databaseUrl], {execArgv: ['--debug=5899']});
            this.childProcess.on('message', function(message){
                if(message==='App Running'){
                    console.log('App Running')
                    clearTimeout(failureTimer);
                    res()
                }
            }.bind(this))

            const failureTimer = setTimeout(
                function(){
                    this.kill();
                    rej("The app was not running within the timeout");
                }.bind(this),
                10e3
            )
        }.bind(this))
    }

    kill(){
        this.childProcess.kill();
        console.log('Child process killed');
    }
}

module.exports = AppChildProcess;