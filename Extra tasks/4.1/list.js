class Node {
    constructor(value, next=null) {
        this.value = value;
        this.next = next;
    }
}

class List {
    constructor(root) {
        this.root = root;
        this._count = 0; // count the number of elements in a list
    }

    get getCount() {
        return this._count;
    }

    set setCount(count) {
        this._count = count;
    }

    //
    addNode(value, i) {
        if(i) {
            if(i > this._count) {
                return false;
            }
            let tmp = this._move(i);
            let node = new Node(value);
            node.next = tmp.next;
            tmp.next = node;
            this._count++;
            return true;
        }
        let tmp = this._move(this._count);
        tmp.next = new Node(value);
        this._count++;
        return true;
    }

    removeNode(i) {
        if(this._count === 0) {
            return false;
        }
        if(i) {
            if(i > this._count) {
                return false;
            }
            let tmp = this._move(i-1);
            tmp.next = tmp.next.next;
            this._count--;
            return true;
        }
        let tmp = this._move(this._count-1);
        tmp.next = null;
        this._count--;
        return true;
    }

    print() {
        let  tmp = this.root;
        while(tmp) {
            console.log(tmp.value + ', ');
            tmp = tmp.next;
        }
    }

    _move(target_pos) {
        let iterator = 0;
        let tmp = this.root;
        while (iterator !== target_pos){
            tmp = tmp.next;
            iterator++;
        }
        return tmp;
    }
}


let list = new List(new Node(0));
for (let i = 1; i < 9; i++) {
    console.log(list.addNode(i));
}
list.print();

console.log(list.addNode(10, 2));
console.log(list.removeNode(5));
console.log(list.removeNode());
console.log(list.addNode(125));
console.log(list.addNode(825, 825));
console.log(list.addNode(845));
console.log(list.removeNode(845));


list.print();
