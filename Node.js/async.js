// var fs = require("fs");

// // 使用sync 同步读取  即需要等待  阻塞
// var data = fs.readFileSync('test.txt');

// console.log(data.toString());
// console.log("程序运行结束");

// ---------非阻塞代码----------
var fs = require("fs");

console.log("开始读文件");
fs.readFile('test.txt', function (err, data) {
    if (err) return console.error(err);
    console.log("文件结果:", data.toString());
});
console.log("处理其他事情");