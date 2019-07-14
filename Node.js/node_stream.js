var fs = require("fs");
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('node_input.txt');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
// data:当有数据可读时触发。
readerStream.on('data', function (chunk) {
    console.log("chunck:", chunk);
    console.log("data:", data);
    data += chunk;
});

readerStream.on('end', function () {
    console.log("end_data:", data);
});

readerStream.on('error', function (err) {
    console.log(err.stack);
});

readerStream.on('finish', function (chunk) {
    console.log("finish_chunck:", chunk);
    console.log("finish:", data);
}); // 不会触发

console.log("程序执行完毕");

// finish所有数据已被写入到底层系统时触发
