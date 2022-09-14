/**
 * @param {number[]} nums
 * @return {number}
 */
 var lengthOfLIS = function(nums) {
  if (nums.length === 0) {
      return 0
  }
  const dp = new Array(nums.length).fill(1)
  for (let i = 1;i < nums.length;i++) {
      for (let j = 0;j < i;j++) {
          if (nums[i] > nums[j]) {
            dp[i] = Math.max(dp[j] + 1, dp[i])
          }
      }
  }
  return  Math.max(...dp)
};

lengthOfLIS([4,10,4,3,8,9])
