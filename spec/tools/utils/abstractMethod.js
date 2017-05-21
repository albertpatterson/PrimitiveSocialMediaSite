const path = require('path');

/**
 * throw an error indicating the class and name of an abstract method that
 * was not yet implemented
 * 
 * @param {String} name the name of the method
 * @param {String} [classname] then name of the class the method should be defined in
 * by default, it is the name of the file calling the abstractMethod function 
 */
function abstractMethod(name, classname){
    classname = classname || path.basename(module.parent.filename,'.js');
    throw new Error(`${name} must be defined in concrete ${classname}`);
};

module.exports = abstractMethod;