function createList(title, items) {
    let list = document.getElementById("list");
    let titleTag = "<h2>" + title + "</h2>";
    list.insertAdjacentHTML("beforeBegin", titleTag);

    list.innerHTML = items.map(item => {
        let htmlStr = `<li>${item.value}</li>`;
        if(item.children !== null) {
            htmlStr += displaySubList(item.children);
        }
        return htmlStr;
    });

}

function displaySubList (list) {
    return list.map(item => {
        let htmlStr = `<ul style="font-size: 90%">`;
        htmlStr += `<li>${item.value}</li>`;
        if(item.children !== null) {
            htmlStr += displaySubList(item.children);
        }
        htmlStr += `</ul>`;
        return htmlStr;
        });
}

let list = [
    {
       value: 'Пункт 1.',
       children: null,
    },
    {
       value: 'Пункт 2.',
       children: [
          {
             value: 'Подпункт 2.1.',
             children: null,
          },
          {
             value: 'Подпункт 2.2.',
             children: [
                {
                   value: 'Подпункт 2.2.1.',
                   children: null,
                },
                {
                   value: 'Подпункт 2.2.2.',
                   children: null,
                }
             ],
          },
          {
             value: 'Подпункт 2.3.',
             children: null,
          }
       ]
    },
    {
       value: 'Пункт 3.',
       children: null,
    }
  ];
  
createList("List",list);