let hello = function () {
    console.log("hello");
}
let hello1 = function () {
    console.log("hello1");
}
let exportsObj = {
    hello : hello,
    hello1 : hello1
};
module.exports = exportsObj;