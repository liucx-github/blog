const http = require('http')

const server = http.createServer()
// request请求事件处理函数需要接收俩个参数
// request请求对象
// 请求对象可以获取客户端的一些请求信息,例如请求路径
// response响应对象
// 响应对象可以用来给客户端发送响应消息
server.on('request',function(request,response){
    console.log('收到客户端的请求了','请求路径是：'+request.url)
    // response对象有一个方法，write可以用来给客户端发送响应数据
    // write可以使用多次，但是最后一次一定要用end来结束响应，否则客户端会一直等待
    response.write("hello ")
    response.write("nodejs")
    response.end()
    //告诉客户端我的话说完了你可以给用户看了
    //由于现在我们的服务器能力很弱，无论是什么请求都只能响应hello nodejs
    // 怎么做到请求不同的路径响应不同的结果
})
server.listen(5000,()=> {
    console.log("服务器启动成功了,可以通过http://127.0.0.1:3000/")
})