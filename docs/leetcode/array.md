# Array数组

## 数组的遍历

### [1、最大连续 1 的个数](https://leetcode.cn/problems/max-consecutive-ones/) 

> 题目：给定一个二进制数组 nums ， 计算其中最大连续 1 的个数。

```js
var findMaxConsecutiveOnes = function(nums) {
 let max = 0 // 最大连续数
 let count = 0 // 计数器
 for(let i = 0; i< nums.length; i++) {
     if(nums[i] === 1) {
         count += 1
     } else {
         max = Math.max(max, count)
         count = 0
     }
    max = Math.max(max, count)
 }
 return max
};
```


### [2、第三大的数](https://leetcode.cn/problems/third-maximum-number/) 

> 题目：给你一个非空数组，返回此数组中 第三大的数 。如果不存在，则返回数组中最大的数。

```js
var thirdMax = function(nums) {
    let a = -Number.MAX_VALUE // 保持a记录最大值
    let b = -Number.MAX_VALUE // 保持第二大值
    let c = -Number.MAX_VALUE // 保持第三大值
    for(let num of nums) {
        if(num > a) {
            c = b
            b = a
            a = num
        } else if(a > num && b < num) {
            c = b 
            b = num
        } else if (b > num && c < num) {
            c = num
        }
    }
    return c ===  -Number.MAX_VALUE ? a : c
};
```

### [3、三个数的最大乘积](https://leetcode.cn/problems/maximum-product-of-three-numbers/description/) 

> 题目：给你一个整型数组 nums ，在数组中找出由三个数组成的最大乘积，并输出这个乘积。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maximumProduct = function(nums) {
    // 数据排序
    nums = nums.sort((a,b) => {
        return a - b
    })
    // 如果数组中全是非负数，则排序后最大的三个数相乘即为最大乘积；
    // 如果全是非正数，则最大的三个数相乘同样也为最大乘积。

    // 如果数组中有正数有负数，则最大乘积既可能是三个最大正数的乘积，
    // 也可能是两个最小负数（即绝对值最大）与最大正数的乘积。

    return Math.max(
        nums[0] * nums[1] * nums[nums.length - 1],
        nums[nums.length - 1] * nums[nums.length - 2] * nums[nums.length - 3]
    )
};
```

## 统计数组元素

### [1、错误的集合](https://leetcode.cn/problems/set-mismatch/) 

> 题目：集合 s 包含从 1 到 n 的整数。不幸的是，因为数据错误，导致集合里面某一个数字复制了成了集合里面的另外一个数字的值，
导致集合 丢失了一个数字 并且 有一个数字重复 。给定一个数组 nums 代表了集合 S 发生错误后的结果。
请你找出重复出现的整数，再找到丢失的整数，将它们以数组的形式返回。
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findErrorNums = function(nums) {
const map = new Map()
// 记录每个数字出现的次数
for(let i = 0; i< nums.length; i++) {
 map.set(nums[i], (map.get(nums[i]) || 0) + 1)
}

const errorNum = Array(2).fill(0)
for(let i = 1 ;i <= nums.length;i++) {
    let count = map.get(i) || 0
    // count === 2 表示重复的整数、count === 0表示没有出现的整数
    if(count === 2) {
        errorNum[0] = i
    } else if(count === 0) {
        errorNum[1] = i
    }
  }
return errorNum
};
```

### [2、数组的度](https://leetcode.cn/problems/degree-of-an-array/) 

> 题目：给定一个非空且只包含非负数的整数数组 nums，数组的度的定义是指数组里任一元素出现频数的最大值。
你的任务是在 nums 中找到与 nums 拥有相同大小的度的最短连续子数组，返回其长度。

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findShortestSubArray = function(nums) {

 // 统计每个元素出现的次数，以及初次出现的位置和最后一次出现的位置
 const entry = {}
 for(let i = 0; i<=nums.length -1;i++) {
     if(nums[i] in entry) {
         entry[nums[i]][0]++ // 出现的次数
         entry[nums[i]][2] = i // 最后出现的位置
     } else {
         entry[nums[i]] = [1, i, i]
     }
 }

 // maxNum元素出现频数的最大值，minLen相同大小的度的最短连续子数组，返回的其长度
 let maxNum = 0, minLen = 0;
 for(const [count, left, right] of Object.values(entry)) {
     if(maxNum < count) {
         maxNum = count
         minLen = right - left + 1
     } else if(maxNum === count) {
         // 取较小值
        minLen = Math.min(minLen, right -left + 1)
     }
 }
 return minLen
};
```

### [3、找到所有数组中消失的数字](https://leetcode.cn/problems/find-all-numbers-disappeared-in-an-array/) 

> 题目：给你一个含 n 个整数的数组 nums ，其中 nums[i] 在区间 [1, n] 内。请你找出所有在 [1, n] 范围内但没有出现在 nums 中的数字，并以数组的形式返回结果。

```log
输入：nums = [4,3,2,7,8,2,3,1]
输出：[5,6]
```

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */

// 那么我们可以想象一下，我们可以让1-n中出现过的数的对应下标 进行 + n操作！
// 这样一来，只要是出现过的数，它对应的下标的元素值都会大于n
// 最后只要再次扫描一遍，判断下标元素值没有大于n的数即可！即为未出现过的元素！
var findDisappearedNumbers = function(nums) {
    const n = nums.length;
    const ret = [];
    for (const num of nums) {
        const x = (num - 1) % n;
        nums[x] += n;
    }
    for (const [i, num] of nums.entries()) {
        if (num <= n) {
            ret.push(i + 1);
        }
    }
    return ret;
};
```

### [3、数组中重复的数据](https://leetcode.cn/problems/find-all-duplicates-in-an-array/) 

> 题目：给你一个长度为 n 的整数数组 nums ，其中 nums 的所有整数都在范围 [1, n] 内，且每个整数出现 一次 或 两次 。请你找出所有出现 两次 的整数，并以数组形式返回。
你必须设计并实现一个时间复杂度为 O(n) 且仅使用常量额外空间的算法解决此问题

```log
输入：nums = [4,3,2,7,8,2,3,1]
输出：[2,3]
```

```js
/**
 * @param {number[]} nums
 * @return {number[]}
 */
// 我们可以给 nums[i] 加上「负号」表示数 已经出现过一次。
var findDuplicates = function(nums) {
    const n = nums.length;
    const ans = [];
    for (let i = 0; i < n; ++i) {
        // nums[i]可能已经是负数了，下标取绝对值保证x为正数
        const x = Math.abs(nums[i]);
        // 如果是负数，则表示出现过一次，放入ans
        if (nums[x - 1] > 0) {
            nums[x - 1] = -nums[x - 1];
        } else {
            ans.push(x);
        }
    }
    return ans;
}
```

### [4、缺失的第一个正数](https://leetcode.cn/problems/first-missing-positive/) 

> 题目：给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。

```log
输入：nums = [1,2,0]
输出：3
```

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
   let result
   // 最小正整数是1，如果没有包含1，则返回1
   if(!nums.includes(1)) {
       return 1
   }

  // 将数组中小于0的数字、大于n的数字重置为1
   let n = nums.length
   for(let i = 0; i< n; i++) {
       if(nums[i] <= 0 || nums[i] > n) {
           nums[i] = 1
       }
   }

   // 给出现的nums[i]加上负数
   for(let i = 0 ; i< n; i++) {
       let x = Math.abs(nums[i])
       if(x <= n) {
            nums[x - 1] = -Math.abs(nums[x - 1])
       }
   }

   // 在遍历完成之后，如果数组中的每一个数都是负数，那么答案是 n + 1，否则答案是第一个正数的位置加 1。
   for(let i = 0 ; i< n; i++) {
       if(nums[i] > 0) {
           result =  i + 1
           return result
       }
   }
   return n + 1
};
```