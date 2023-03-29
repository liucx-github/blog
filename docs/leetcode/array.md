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

## 数组的改变、移动
### [1、最小操作次数使数组元素相等](https://leetcode.cn/problems/minimum-moves-to-equal-array-elements/) 

> 题目：给你一个长度为 n 的整数数组，每次操作将会使 n - 1 个元素增加 1 。返回让数组所有元素相等的最小操作次数。

```log
输入：nums = [1,2,3]
输出：3
解释：
只需要3次操作（注意每次操作会增加两个元素的值）：
[1,2,3]  =>  [2,3,3]  =>  [3,4,3]  =>  [4,4,4]
```

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
// 每次操作既可以理解为使  n-1个元素增加 1，也可以理解使 1 个元素减少 1
var minMoves = function(nums) {
    const minNum = Math.min(...nums);
    let res = 0;
    for (const num of nums) {
        res += num - minNum;
    }
    return res;
};
```

### [2、非递减数列](https://leetcode.cn/problems/non-decreasing-array/) 

> 题目：给你一个长度为 n 的整数数组 nums ，请你判断在 最多 改变 1 个元素的情况下，该数组能否变成一个非递减数列。

我们是这样定义一个非递减数列的： 对于数组中任意的 i (0 <= i <= n-2)，总满足 nums[i] <= nums[i + 1]。

```log
输入: nums = [4,2,3]
输出: true
解释: 你可以通过把第一个 4 变成 1 来使得它成为一个非递减数列。
```

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var checkPossibility = function(nums) {
 // 临界场景判断,数组长度小于3个，一定可以
 if(nums.length < 3) {
     return true
 }
 // 思路，如果 a[i] > a[i+1], 此时需要改变这两个数其中的一个
 // 1、 把a[i]减少，还是把a[i+1]变大，需要比较a[i-1]和a[i+1]的值
 let changeCount = 0
 if(nums[1] < nums[0]) {
     nums[0] = nums[1]
     changeCount++
 }
 for(let i = 1; i< nums.length;i++) {
     if(nums[i] > nums[i+1]) {
         changeCount++
         if(changeCount === 2) {
             return false
         } else {
             if( nums[i - 1] > nums[i+1]) {
                // 需要把n[i+1]变大
                 nums[i+1] = nums[i]
             } else {
                // 需要把n[i]变小
                 nums[i] = nums[i - 1]
             }
         }
     }
 }
 return true
};
```


### [3、移动零](https://leetcode.cn/problems/move-zeroes/) 

> 题目：给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
请注意 ，必须在不复制数组的情况下原地对数组进行操作。


```log
输入: nums = [0,1,0,3,12]
输出: [1,3,12,0,0]
```

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
 let j = 0
 for(var i = 0;i<nums.length;i++) {
     if(nums[i] !== 0) {
         nums[j++] = nums[i]
     }
 }
 while(j<nums.length) {
     nums[j++] = 0
 }
 return nums
};
```

## 二维数组及滚动数组
### [1、杨辉三角](https://leetcode.cn/problems/pascals-triangle/) 

> 题目：给定一个非负整数 numRows，生成「杨辉三角」的前 numRows 行。

在「杨辉三角」中，每个数是它左上方和右上方的数的和。

```js
var generate = function(numRows) {
    let result = [];
    if(numRows === 0) {
        return
    } else {
        for (let index = 0; index < numRows; index++) {
            const temp = new Array(index + 1).fill(1)
            for (let j = 1; j < temp.length - 1; j++) {
                temp[j] = result[index-1][j-1] + result[index-1][j]
            }
            result.push(temp)
        }
    }
    return result
};
```

## 数组的旋转
### [1、轮转数组](https://leetcode.cn/problems/rotate-array/) 

> 题目：给定一个整数数组 nums，将数组中的元素向右轮转 k 个位置，其中 k 是非负数。

```log
输入: nums = [1,2,3,4,5,6,7], k = 3
输出: [5,6,7,1,2,3,4]
解释:
向右轮转 1 步: [7,1,2,3,4,5,6]
向右轮转 2 步: [6,7,1,2,3,4,5]
向右轮转 3 步: [5,6,7,1,2,3,4]
```

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
const reverse = (nums, start, end) => {
    while (start < end) {
        const temp = nums[start];
        nums[start] = nums[end];
        nums[end] = temp;
        start += 1;
        end -= 1;
    }
}

var rotate = function(nums, k) {
    k %= nums.length;
    reverse(nums, 0, nums.length - 1); // 数组完全翻转
    reverse(nums, 0, k - 1); // 翻转0 到 k -1的数组
    reverse(nums, k, nums.length - 1); // 翻转k到最后的剩余部分
};

```


## 特定顺序遍历二维数组
### [1、螺旋矩阵II](https://leetcode.cn/problems/spiral-matrix-ii/) 

> 题目：给你一个正整数 n ，生成一个包含 1 到 n2 所有元素，且元素按顺时针顺序螺旋排列的 n x n 正方形矩阵 matrix 。

```log
输入：n = 3
输出：[[1,2,3],[8,9,4],[7,6,5]]
```

```js

/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function(n) {
    let startX = startY = 0;   // 起始位置
    let loop = Math.floor(n/2);   // 旋转圈数
    let mid = Math.floor(n/2);    // 中间位置
    let offset = 1;    // 控制每一层填充元素个数
    let count = 1;     // 更新填充数字
    let res = new Array(n).fill(0).map(() => new Array(n).fill(0));

    while (loop--) {
        let row = startX, col = startY;
        // 上行从左到右（左闭右开）
        for (; col < n - offset; col++) {
            res[row][col] = count++;
        }
        // 右列从上到下（左闭右开）
        for (; row <  n - offset; row++) {
            res[row][col] = count++;
        }
        // 下行从右到左（左闭右开）
        for (; col > startY; col--) {
            res[row][col] = count++;
        }
        // 左列做下到上（左闭右开）
        for (; row > startX; row--) {
            res[row][col] = count++;
        }

        // 更新起始位置
        startX++;
        startY++;

        // 更新offset
        offset += 1;
    }
    // 如果n为奇数的话，需要单独给矩阵最中间的位置赋值
    if (n % 2 === 1) {
        res[mid][mid] = count;
    }
    return res;
};

```


## 前缀和数组

### [1、除自身以外数组的乘积](https://leetcode.cn/problems/product-of-array-except-self/description/) 

> 题目：给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。

题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。

请不要使用除法，且在 O(n) 时间复杂度内完成此题。

```log
输入: nums = [1,2,3,4]
输出: [24,12,8,6]
```

```js
var productExceptSelf = function (nums) {
    const res = [];
    res[0] = 1;
  	//从左往右遍历
  	//记录从左到当前位置前一位的乘积
    for (let i = 1; i < nums.length; i++) {
        res[i] = res[i - 1] * nums[i - 1];
    }

    let right = 1;
  	//从右往左遍历
  	//从左到当前位置前一位的乘积res[j] 乘上 右边元素的积right
    for (let j = nums.length - 1; j >= 0; j--) {
        res[j] = res[j] * right;
        right = right * nums[j];
    }

    return res;
};
```
