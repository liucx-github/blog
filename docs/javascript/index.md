# Javascript

## 1、函数柯里化

> 所谓"柯里化"，就是把一个多参数的函数，转化为单参数函数。

```js
// 柯里化之前
function add(x, y) {
  return x + y;
}

add(1, 2) // 3

// 柯里化之后
function addX(y) {
  return function (x) {
    return x + y;
  };
}

addX(2)(1) // 3
```

```js
// 将函数进行柯里化处理
function add(x, y, z) {
    return x + y + z
}

function ftCurrying(fn) {
  function curryingFn(...args) {
    if(args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function(...newArgs) {
        return curryingFn.apply(this, [...args, ...newArgs])
      }
    }
  }
  return curryingFn
}

const curry = ftCurrying(add)

console.log(curry(1)(2)(3)) // 6
```

## 2、闭包

> 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外调用执行

```js
function foo() {
  var a = 1
  return bar() {
    console.log(a) 
  }
}
var baz = foo()
baz() // 2 朋友，这就是闭包的效果

// 1、函数bar可以访问foo的作用域，我们将bar函数本身当作一个值类型进行传递。
// 2、在foo函数执行后，其返回值赋值给变量baz并调用baz(), 实际上只是通过不同的标识符引用
// 调用了内部函数bar()
// 3、bar显然可以正常执行，但是它在自己定义的词法作用域以外的地方执行。

// 4、无论通过何种手段将内部函数传递到所在的词法作用域以外，它都会持有对
//  原始定义作用域的引用，无论在何处执行这个函数都会使用闭包
```

```js
function wait(message) {
  setTimeout(function timer() {
    console.log(message);
  }, 1000)
}

wait('hello, closure')

// 1、将一个内部函数timer传给setTimeout, timer具有涵盖wait作用域的闭包，因此还保有对变量message的引用
// 2、wait执行1000毫秒后，他的内部作用域并不会消失，timer函数依然保有wait的作用域闭包

// 3、在定时器，事件监听器，Ajax请求，或者其他异步（同步）任务中，
// 只要使用了回调函数，实际上就是在使用闭包

```

## 3、事件循环
```js
// 如果你的js程序发出一个Ajax请求，从服务器获取一些数据，
// 那你就在一个函数（回调函数）中设置好响应代码，
// 然后js引擎会通知宿主环境，“嘿，现在我要暂停执行，你一旦完成网络请求，拿到数据，就请调用这个函数。”
// 然后浏览器就会设置侦听来自网络的请求，拿到要给你的数据以后，
// 就会把回调函数插入事件循环，以此实现对这个回调的调度执行

var eventLoop = [] // 先进先出队列
var event;
while(true) {
  // 一次tick
  if(eventLoop.length > 0) {
    event = eventLoop.shift();
    try {
      event();
    }catch(err) {
      console.log(err)
    }
  }
}

// 循环的每一轮称为一个tick，对于每个tick而言，
// 如果队列中有等待事件，那么就会从队列中摘下一个事件执行。这些事件就是你的回调函数

// 一定要清楚，setTimeout()并没有把你的回调函数挂在事件循环队列中，
// 它所做的是设置一个定时器，当定时器到时后，环境会把你的回调函数放在事件循环中
// 这样，在未来的某个时刻的tick会摘下并执行这个回调
// 如果这个时候事件循环中已经有20个项目了，你的回调就会等待。这也解释了为什么setTimeout定时器的精度并不高。
```