const fs = require('fs');

function checkExist(path){
    return new Promise(function(res, rej){
        fs.access(path, function handler(err){
            if(err===null){
                res(true);
            }else if(err.code==='ENOENT'){ 
                res(false);    
            }else{
                rej(err);
            }
        });
    });
}

module.exports = checkExist;