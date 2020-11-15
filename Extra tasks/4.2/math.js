let add = (a, b) => {
    if(b !== undefined) {
        return a + b;
    }
    return function(b) {
        return b + a;
    }
}

let sub = (a, b) => {
    if(b !== undefined) {
        return a - b;
    }
    return function(b) {
        return b - a;
    }
}

let mul = (a, b) => {
    if(b !== undefined) {
        return a * b;
    }
    return function(b) {
        return b * a;
    }
}

let div = (a, b) => {
    if(b !== undefined) {
        return a / b;
    }
    return function(b) {
        return b / a;
    }
}

let pipe = (...args) => {
    return function(b) {
        let x = b;
        for (let i = 0; i < args.length; i++){
            x = args[i](x);
        }
        return x;
    }
}

console.log(add(2, 0));

let a = add(1,2); // 3
let b = mul(a, 10); // 30

let sub1 = sub(1); // sub1 отнимает от любого числа единицу
let c = sub1(b); // 29
console.log("c = ", c);

let d = mul(sub(a,1))(c);
console.log("d = ", d); // 58

let doSmth = pipe(add(d), sub(c), mul(b), div(a)); // функция, последовательно выполняющая эти операции.
let result = doSmth(0); // (((0 + 58) - 29) * 30) / 3 = 290
console.log("result = ", result);
let x = pipe(add(1), mul(2))(3); // 8
console.log("x = ", x);
