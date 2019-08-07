var doubleBall = require('./doubleColorBall');

// 引入所需的Node.js 模块
var http = require("http");
var querystring = require('querystring');
// 接下来我们使用 http.createServer() 方法创建服务器
http.createServer(function (request, response) {
    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    let post = "";
    if (request.method == "POST") {
        request.on('data', function (chunk) {
            post += chunk;
            // console.log(post);
        });
        request.on('end', function () {
            post = querystring.parse(post);
            // console.log("after:",post);
            let res = doubleBall.run(post.times);
            if (typeof res === "string") {
                response.writeHead(304, {
                    'Content-Type': 'text/html,text/json'
                });
                response.end(res);
            }else{
                response.writeHead(200, {
                    'Content-Type': 'text/html,text/json'
                });
                response.end(JSON.stringify(res));
            }           
        });

    } else {
        response.writeHead(304, {
            'Content-Type': 'text/html'
        });
        response.end("refuse this request");
    }





}).listen(8888); // 使用 listen 方法绑定 8888 端口







// let arr = Object.keys(request);
// let resStr = "";
// arr.forEach(ele => {
//     resStr += ele;
//     resStr += "<br>";
// });
// 发送响应数据 "Hello World"

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
// console.clear();