module.exports = function(dob) {
    ms = new Date() - new Date(dob);
    return Math.floor(ms/(1000*60*60*24*365));
}