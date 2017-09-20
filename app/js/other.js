'use strict';

let arr = [12, 24, 45, 234, 23, 56],
    obj = {
        name: 'Vasya'
    },
    obj2 = {
        name: 'Ilya'
    }


function go(...args) {
    let [text] = [...args]

    if (this.name !== 'Ilya') {
        alert(this.name + ' - 7 кругов ада, собеседовать минимум вдесятером, спросить: про ООП в js, scope, каррирование')
    } else {
        alert(this.name + text)
    }
}

/*так получилось, что я не знаю что добавить https://learn.javascript.ru/bind*/
function bind(method, context) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function () {
        var a = args.concat(Array.prototype.slice.call(arguments, 0));
        return method.apply(context, a);
    }
}

let s = bind(go, obj, ' - взять на работу без мучительных тех. собеседований')
let ss = bind(go, obj2, ' - взять на работу без мучительных тех. собеседований', 'srzgarrg')
console.log(s())
console.log(ss())

/*inArray*/
function inArray(num, arr) {
    const _arr = arr ? arr : this
    return _arr.some(item => item === num)
}

Array.prototype.inArray = inArray
console.log(arr.inArray(12), inArray(47, arr))


