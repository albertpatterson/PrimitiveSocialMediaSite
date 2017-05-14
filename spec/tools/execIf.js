module.exports = function execIf(func){
    if(typeof func === 'function') return func();
}