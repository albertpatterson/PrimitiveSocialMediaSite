function validateFunction(item){
    return (typeof item === 'function')?item:Promise.resolve();
}

module.exports = validateFunction;