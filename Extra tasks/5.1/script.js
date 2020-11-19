function createCalendar(elem, year, month) {
    let date = new Date(year, month-1);
    let nextMonth = new Date(year, month);
    let weekDay = date.getDay();
    if (weekDay === 0) {
        weekDay = 6;
    }
    else {
        weekDay = weekDay - 1;
    }
    let daysInMonth = (nextMonth - date) / 86400000;
 //   let days = daysInMonth + weekDay;
    let daysArr = [];
    while (weekDay > 0){
        daysArr.push('');
        weekDay--;
    }
    for (let i = 0; i < daysInMonth; i++ ){
        daysArr.push(i+1);
    }
    let table = document.getElementById(elem);
    for (let i = 0; i <= daysInMonth; i= i + 7 ){
        table.innerHTML += displayWeek(daysArr.slice(i, i + 7));
    }
    
}

function displayWeek (arr) {
    let htmlStr = `<tr>`;
    while(arr.length < 7) {
        arr.push('');
    }
    for(let i = 0; i < arr.length; i++) {
        htmlStr += `<td>`;
        htmlStr += arr[i];
        htmlStr += `</td>`;
    }
    htmlStr += `</tr>`;
    return htmlStr;
}
//createCalendar("table-body", 2012, 9);
createCalendar("table-body", 2019, 2);