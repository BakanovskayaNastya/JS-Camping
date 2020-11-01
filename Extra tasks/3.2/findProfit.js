let arr1 = [7,1,5,3,6,4]; // 7
let arr2 = [1,2,3,4,5];   // 4
let arr3 = [7,6,4,3,1];   // 0 
let arr4 = [ 1, 3, 5, 25, 58, 40, 100, 17, 48, 24]; // 148

let findProfit = (arr) => {
    let current_price = arr[0]; 
    let daily_profit = 0;
    let profit = 0; 

    for (let i = 1; i < arr.length; i++) {
        if (current_price < arr[i]) {
            daily_profit = arr[i] - current_price;
            profit += daily_profit;
        }
        current_price = arr[i]; 
    }
    return profit;
}

console.log("arr1 (must be 7): ", findProfit(arr1));
console.log("arr2 (must be 4): ", findProfit(arr2));
console.log("arr3 (must be 0): ", findProfit(arr3));
console.log("arr4 (must be 148): ", findProfit(arr4));