function createList(title, items) {
    let list = document.getElementById("list");
    let titleTag = "<h2>" + title + "</h2>";
    list.insertAdjacentHTML("beforeBegin", titleTag);

    list.innerHTML = items.map(item => {
        let htmlStr = `<li>${item.value}`;
        let id = 0;
        if(item.children !== null) {
           id ++;
           htmlStr += displaySubList(item.children, id);
        }
        htmlStr += `</li>`;
        return htmlStr;
    });

}

function displaySubList (list, id) {
   let htmlStr = `<ul id="${id}" style="font-size: 90%">`;
   list.map(item => {
      htmlStr += `<li>${item.value}`;
      if(item.children !== null) {
         htmlStr += displaySubList(item.children);
      }
      htmlStr += `</li>`;
      return htmlStr;
      });
   htmlStr += `</ul>`;
   return htmlStr;
}

function collapse(event) {
   if (event.target.children[0]) {
      const childId = event.target.children[0].id;
      if (document.getElementById(childId).style.display === 'none') {
         document.getElementById(childId).style.display = 'block';
      }
      else {
         document.getElementById(childId).style.display = 'none';
      }
   }
}

const collapseButton = document.getElementById('list');
collapseButton.addEventListener('click', (event) => {
   collapse(event);
});

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