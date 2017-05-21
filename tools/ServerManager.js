const debug = require('debug')('prac4-1:server');
const http = require('http');

/**
 * manager of app hosting server
 * 
 * @class ServerManager
 */
class ServerManager{
    /**
     * Creates an instance of ServerManager.
     * @param {any} app the app to host on the server
     * 
     * @memberOf ServerManager
     */
    constructor(app){
        this.app = app;

        this.port = normalizePort(process.env.PORT || '3000');
        this.app.set('port', this.port);

        this.server = http.createServer(this.app);
        this.server.on('error', this._onError.bind(this));
        this.server.on('listening', this._onListening.bind(this));
    }

    /**
     * listen for requests
     * 
     * @returns {Promise} resolved when the server begins listening for requests 
     * 
     * @memberOf ServerManager
     */
    listen(){
        return  this.app.connect()
                .then(function(){
                    return new Promise(function(res){
                        /**
                         * Listen on provided port, on all network interfaces.
                         */
                        this.server.listen(this.port, res);
                    }.bind(this));
                }.bind(this))
                .catch(err=>console.log(err))
    }

    /**
     * close the server and no longer listen for requests
     * 
     * @returns {Promise} resolved when the server is closed
     * 
     * @memberOf ServerManager
     */
    close(){
        return  new Promise(res=>this.server.close(res))
                .then(function(){
                    return this.app.close();
                }.bind(this))
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    _onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof this.port === 'string'
            ? 'Pipe ' + this.port
            : 'Port ' + this.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
            case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
            default:
            throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */
    _onListening() {
        var addr = this.server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
        console.log(`listening on port ${this.port}`)
    }    
}

  /**
   * Normalize a port into a number, string, or false.
   */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

module.exports = ServerManager;