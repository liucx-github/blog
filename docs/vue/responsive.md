# Vue响应式的作用与实现

## 1、响应式式数据的基本实现思路

```js
const obj = {
    text: 'hello world'
}
// 副作用函数
function effect() {
    document.body.innerHtml = obj.text;
}

effect()

```
我们期望obj.text的值改变的时候，副函数可以重新执行，页面内容重新渲染。

* 当effect执行的时候，会触发字段obj.text的**读取**操作
* 当修改obj.text的时候，会触发字段obj.text的**设置**操作

> 如果我们能够拦截对象的读取和设置操作，事情就变的简单了。vue2中使用Object.defineProperty函数的方式，vue3中使用Proxy来实现。

## 2、设计一个完善的响应式系统

```js
// 用一个全局变量存贮被注册的副作用函数
let activeEffect

// effect 函数用来注册副作用函数

function effect(fn) {
    activeEffect = fn;
    fn()
}

// 存储副作用函数的桶
const bucket = new WeakMap()

const obj = new Proxy(data, { 
    // 拦截读取操作
    get(target, key) {
        // 将副作用函数activeEffect 添加到存储副作用函数的桶中
        track(target, key)
        // 返回属性值
        return target[key]
    },
    set(target, key, value) {
        // 设置属性值
        target[key] = value
        // 把副作用函数从桶中取出并执行
        trigger(target, key)
    }
})

// 在get拦截函数中调用track函数追踪变化
function track(target, key) {
    if(!activeEffect) return
    let depsMap = bucket.get(target)
    if(!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if(!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
}

// 在set拦截函数内调用 trigger函数触发变化
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if(!depsMap) return
    const effects = depsMap.get(key)
    // 避免无限执行，这是后话
    const effectsToRun = new Set(effects)
    effectsToRun && effectsToRun.forEach(fn => fn())
}
```

> 用一段代码讲一下weakMap和Map的差别

```js
const map = new Map()
const weakMap = new WeakMap()

(function() {
    const foo = {foo: 1}
    const bar = {bar: 2}
    map.set(foo, 1)
    weakMap.set(bar, 2)
})()

// 当函数执行完毕后，对于对象foo来说，它仍然作为map的key被引用着，
// 因此垃圾回收器不会把它从内存中移除。我们仍然可以通过，map.keys打印出foo。
// 然而对于对象bar来说，由于weakMap是弱引用，它不影响垃圾回收器的工作，所以一旦
// 表达式执行完毕，垃圾回收器就会把对象bar从内存中移除，并且我们无法获取weakMap的key值
// 也就无法通过weakMap获取对象bar

```

## 3、分支切换与cleanup

>看下面一段代码

```js
const data = {
    text: 'Hello  world',
    ok: true,
}

// 添加响应式
const obj = new Proxy(data, {...})

effect(function effectFn() {
    document.body.innerHTML = obj.ok ? obj.text: 'no'
})

```
* 此后 当obj.ok或者obj.text两者有一个改变的值当时候，都会触发effectFn函数

* 但是当obj.ok === false的时候，obj.text无论怎么改变，页面内容都不会发生改变。此时副函数一直都在执行，明显是不必要的。


> 解决思路：每次副作用函数执行的时候，我们先把它所有与之关联的依赖集合删除，当副作用函数执行完毕的时候，重新建立联系

```js
// 用一个全局变量存贮被注册的副作用函数
let activeEffect

// effect 函数用来注册副作用函数

function effect(fn) {
    const effectFn =  () => {
        cleanup(effectFn)
        activeEffect = effectFn;
        fn()
    }
    effectFn.deps = []
    effectFn()
}

function track(target, key) {
    if(!activeEffect) return
    let depsMap = bucket.get(target)
    if(!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if(!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)

    activeEffect.deps.push(deps) // deps就是一个与当前副作用函数存在联系的依赖集合

    // 有了上面的联系以后，我们就可以在每次副作用函数执行的时候，
    // 根据effectFn.deps获取所有相关依赖集合，进而将副作用函数从依赖集合里面移除
}
```

> cleanup函数实现

```js
function cleanup(effectFn) {
    // 遍历effectFn.deps数组
    for(let i = 0; i<effectFn.deps.length; i++) {
        const deps = effectFn.deps[i];
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0
}
```

## 4、嵌套的effect和effect栈

> Vue.js的渲染函数实际就是在一个effect中执行：

```js
// Foo组件
const Foo = {
    render() {
        return ...
    }
}
```
在一个effect中执行Foo组件的渲染函数
```js
effect(() => {
    Foo.render()
})
```

当组件发生嵌套的时候，比如Foo组件渲染了Bar组件

```js
// Bar组件
const Bar = {
    render() {
        return ...
    }
}

// Foo组件渲染了Bar组件
const Foo = {
    render() {
        return <Bar/>
    }
}
```

此时就会发生嵌套，相当于:

```js
effect(() => {
    Foo.render()
    effect(() => {
        Bar.render()
    })
})
```

目前我们上述实现的effect函数，并不能支持嵌套： 

```js 
const data = {
    foo:true,
    bar:true,
}

// 代理对象
const obj = new Proxy(data, ...)

// 全局变量
let temp1 , temp2

effect(function effectFn1() {
    console.log('effectFn1执行了')
    effect(function effectFn2() {
        console.log('effectFn2执行了')
        temp2 = obj.bar
    })
    temp1 = obj.foo
})

//  我们尝试修改obj.foo值的时候，发现打印的却是effectFn2执行了
```

问题出现在activeEffect上。
当副作用函数发生嵌套的时候，内层副作用函数的执行会覆盖activeEffect的值，并且不会恢复。

优化如下：引入effectStack

```js
const effectStack = []
function effect(fn) {
    const effectFn =  () => {
        cleanup(effectFn)
        activeEffect = effectFn;
        effectStack.push(effectFn)
        fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
    }
    effectFn.deps = []
    effectFn()
}
```

## 5、避免无限循环

```js
const data = {
    foo: 1
}
const obj = new Proxy(data, ...)
effect(() => {
    obj.foo= obj.foo + 1
})

// 此时副作用函数还没执行完毕的时候，就要开始下一次的执行。会导致无限的调用自己
```

```js
function trigger(target, key) {
    const depsMap = bucket.get(target)
    if(!depsMap) return
    const effects = depsMap.get(key)
    const effectsToRun = new Set()
    effects && effects.forEach(fn => {
        // 如果trigger触发的副作用函数与当前正在执行的副作用函数相等，则不进行触发。
        if(activeEffect !== fn) {
            effectsToRun.add(fn)
        }
    })
    effectsToRun.forEach(fn => fn())
}
```


