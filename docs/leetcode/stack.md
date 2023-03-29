# 栈

## 用栈访问最后若干元素

### [1、棒球比赛](https://leetcode.cn/problems/baseball-game/description/) 

题目：你现在是一场采用特殊赛制棒球比赛的记录员。这场比赛由若干回合组成，过去几回合的得分可能会影响以后几回合的得分。

比赛开始时，记录是空白的。你会得到一个记录操作的字符串列表 ops，其中 ops[i] 是你需要记录的第 i 项操作，ops 遵循下述规则：

* 整数 x - 表示本回合新获得分数 x
* "+" - 表示本回合新获得的得分是前两次得分的总和。题目数据保证记录此操作时前面总是存在两个有效的分数。
* "D" - 表示本回合新获得的得分是前一次得分的两倍。题目数据保证记录此操作时前面总是存在一个有效的分数。
* "C" - 表示前一次得分无效，将其从记录中移除。题目数据保证记录此操作时前面总是存在一个有效的分数。
请你返回记录中所有得分的总和。

```log
输入：ops = ["5","2","C","D","+"]
输出：30
解释：
"5" - 记录加 5 ，记录现在是 [5]
"2" - 记录加 2 ，记录现在是 [5, 2]
"C" - 使前一次得分的记录无效并将其移除，记录现在是 [5].
"D" - 记录加 2 * 5 = 10 ，记录现在是 [5, 10].
"+" - 记录加 5 + 10 = 15 ，记录现在是 [5, 10, 15].
所有得分的总和 5 + 10 + 15 = 30

```

```js 
/**
 * @param {string[]} operations
 * @return {number}
 */
var calPoints = function(operations) {
let stack = []
for(let i = 0; i< operations.length;i++) {
    const current = operations[i]
    if(current === 'C') {
        stack.pop()
    } else if(current === '+') {
        let sum = +stack[stack.length - 1] + +stack[stack.length - 2]
        stack.push(sum)
    } else if(current === 'D') {
         stack.push(stack[stack.length - 1] * 2)
    } else {
        stack.push(+current)
    }
 }
return stack.reduce((prev, next) => {
        return prev + next
}, 0)
};
```

## 栈与计算器

### [1、基本计算器 II](https://leetcode.cn/problems/basic-calculator-ii/) 

题目：给你一个字符串表达式 s ，请你实现一个基本计算器来计算并返回它的值。

整数除法仅保留整数部分。

你可以假设给定的表达式总是有效的。所有中间结果将在 [-231, 231 - 1] 的范围内。

注意：不允许使用任何将字符串作为数学表达式计算的内置函数，比如 eval() 。

```log
输入：s = "3+2*2"
输出：7

输入：s = " 3/2 "
输出：1
```

```js
var calculate = function(s) {
    let stack = [],n = 0,sign = '+'
    for (let i = 0; i <= s.length; i++) {
        const ch = s[i]
        if (ch === ' ') continue
        if (ch >= '0' && ch <= '9') {
            n = 10 * n + parseInt(ch)
            continue
        }
        // 好家伙，这就完事了！！！
        // 先把乘除法给计算了，stack 中只要相加就是最终结果了 
        // 还用 ~~ 替代 Math.floor
        switch (sign) {
            case '+': stack.push(n); break
            case '-': stack.push(-n); break
            case '*': stack.push(n * stack.pop()); break
            case '/': stack.push(~~(stack.pop() / n)); break
        }
        n = 0
        sign = ch
    }
    // 最后 stack 中的元素只要加起来就行了
    return stack.reduce((pre, cur) => pre + cur, 0)
}
```

## 栈与括号匹配

### [1、有效的括号](https://leetcode.cn/problems/valid-parentheses/) 

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
每个右括号都有一个对应的相同类型的左括号。

```log
输入：s = "()"
输出：true
```

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    let stack = []
    let result = true
    if(s.length<2) {
        return false
    } else {
        for (let index = 0; index <= s.length -1; index++) {
            if(!result) {
                break
            };
            if(s[index] === '(' || s[index] === '[' || s[index] === '{') {
                stack.push(s[index])
            } else {
                let pop= stack.pop()
                if(s[index] === ')' && pop === '(' || s[index]===']' && pop === '[' || s[index] === '}' && pop === '{') {
                    result = true
                } else {
                    result = false
                }
            }
        }
        return stack.length === 0 && result
    }
};
```

### [2、最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/description/) 

给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

```log
输入：s = ")()())"
输出：4
解释：最长有效括号子串是 "()()"
```


```js
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function (s) {
    let maxLen = 0
    let stack = []
    stack.push(-1) // 初始化一个参照物
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            // ( 入栈   )出栈
            stack.push(i)
        } else {
            // )的情况 出栈
            stack.pop()
            if (stack.length) {
                // 每次出栈 计算下当前有效连续长度
                // 如何计算连续长度 当前位置 - 栈顶下标
                maxLen = Math.maxLen(maxLen, i - stack[stack.length - 1])
            } else {
                stack.push(i) //栈为空时 放入右括号参照物 表示从这个下标开始 需要重新计算长度
            }
        }
    }
    return maxLen
};
```