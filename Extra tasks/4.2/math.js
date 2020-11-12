let add = (a, b) => {
    if(b) {
        return a + b;
    }
    return function(b) {
        return b + a;
    }
}

let sub = (a, b) => {
    if(b) {
        return a - b;
    }
    return function(b) {
        return b - a;
    }
}

let mul = (a, b) => {
    if(b) {
        return a * b;
    }
    return function(b) {
        return b * a;
    }
}

let div = (a, b) => {
    if(b) {
        return a / b;
    }
    return function(b) {
        return b / a;
    }
}

let a = add(1,2); // 3
let b = mul(a, 10); // 30

let sub1 = sub(1); // sub1 отнимает от любого числа единицу
let c = sub1(b); // 29
console.log("c = ", c);

let d = mul(sub(a,1))(c);
console.log("d = ", d); // 58

