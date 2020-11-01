let arr1 = [-2,1,-3,4,-1,2,1,-5,4];
let arr2 = [1, -2, -3, 4, -6, 8];
let arr3 = [-1, -2, -5];
let arr4 = [0, -5, 10, 18, 150, 2000, -10000,  400, 10, 25];


let maxSubarray = (arr) => {
    let max_in_arr = 0;
    let values_found = [];
    let sum = 0;
    for (let i in arr) {
        if (arr[i] > 0 || (sum + arr[i]) > 0) {
            sum+= arr[i];
            values_found.push(sum);
        }
        else {
            sum = 0;
        }
    }
    for (let i in values_found) {
        if (values_found[i] > max_in_arr) {
            max_in_arr = values_found[i];
        }
    }
    return max_in_arr
}

console.log("Result must be 6: ", maxSubarray(arr1));
console.log("Result must be 8: ", maxSubarray(arr2));
console.log("Result must be 0: ", maxSubarray(arr3));
console.log("Result must be 2178: ", maxSubarray(arr4));