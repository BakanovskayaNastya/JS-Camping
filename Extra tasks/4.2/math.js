let add = (a, b) => {
    if(b) {
        return a + b;
    }
    return function(b) {
        return a + b;
    }
}

let sub = (a, b) => {
    return a - b;
}

let mul = (a, b) => {
    return a * b;
}

let div = (a, b) => {
    return a / b;
}

let a = add(1,2); // 3
let b = mul(a, 10); // 30

let sub1 = sub(1); // sub1 отнимает от любого числа единицу
let c = sub1(b); // 29
