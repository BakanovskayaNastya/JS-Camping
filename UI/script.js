class Message {
    constructor(user, msg) {
        this._id = msg.id || `${new Date()}`;
        this._createdAt = msg.createdAt || new Date();
        this._author = msg.author || user;
        this._text = msg.text;
        this._isPersonal = msg.isPersonal;
        if(msg.to) {
            this._to = msg.to;
        }
    }

    get id() {
        return this._id;
    }

    get author() {
        return this._author;
    }

    get createdAt() {
        return this._createdAt;
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
    }

    get isPersonal() {
        return this._isPersonal;
    }

    set isPersonal(isPersonal) {
        this._isPersonal = isPersonal;
    }
    
    get to() {
        return this._to;
    }

    set to(to) {
        this._to = to;
    }
}

class MessageList {

    _user = null;
    constructor(msgs) {
        this._messages = [];
        msgs.forEach(item => {
            this._messages.push(new Message(this._user, item));
        });
    }

    get user() {
        return this._user;
    }

    set user(user) {
        this._user = user;
    }

    get messages() {
        return this._messages;
    }

    _filterObj = {
        author: (item, author) => !author || item.author.toLowerCase().includes(author.toLowerCase()),
        text: (item, text) => !text || item.text.toLowerCase().includes(text.toLowerCase()),
        dateFrom: (item, dateFrom) => !dateFrom || item.createdAt > dateFrom,
        dateTo: (item, dateTo) => !dateTo || item.createdAt < dateTo
    }

    static _validObj = {
    	text: (item) => item.text && item.text.length <= 200
    }

    //messages
    getPage(skip = 0, top = 10, filterConfig) {
        let result = this._messages.slice();

        result = result.filter(item => {
            if(item.author === this._user || item.isPersonal === false || (item.isPersonal === true && item.to === this._user)) {
                return true;
            }
            return false;
        })
        
        if (filterConfig) {
            Object.keys(filterConfig).forEach((key) => {
                result = result.filter((item) => this._filterObj[key](item, filterConfig[key]));
            });
        } 
        result.sort( (a, b) => {
            return b.createdAt - a.createdAt;
        });
        return result.splice(skip, skip + top).reverse();
    }

    //getMessage
    get(id) {
        let message = this._messages.find(item => item.id === id);
        if (message && message.author === this._user) {
            return message;
        }
        return null;
    }

    //addMessage
    add(msg) {
        let message = new Message(this._user, msg);
        if(MessageList.validate(message)){
            this._messages.push(message);
            return true;
        }
        return false;
    }

    //editMessage
    edit(id, msg) {
        let index = this._messages.findIndex(item => item.id === id);
        if (index !== -1 && this._messages[index].author === this._user) {
            let newMessage = new Message(id, msg);
            if(MessageList.validate(newMessage)) {
                if (msg.text) {
                    this._messages[index].text = newMessage.text;
                }
                if (msg.isPersonal) {
                    this._messages[index].isPersonal = newMessage.isPersonal;
                }
                if (msg.to && msg.isPersonal) {
                    this._messages[index].to = newMessage.to;
                }
                return true;
            }
        }
        
        return false;
    }

    //removeMessage
    remove(id) {
        let index = this._messages.findIndex(item => item.id === id);
        if (index !== -1 && this._messages[index].author === this._user) {
            let messageDeleted = this._messages.splice(index, 1);
            return true;
        }
        return false;
    }

    //validateMessage
    static validate(msg) {
        return Object.keys(this._validObj).every((key) => this._validObj[key](msg));
    }

    //add all messages from the array to collection
    addAll(msgs) {
        let notValidMessages = [];
        msgs.forEach(item => {
            if(MessageList.validate(item)) {
                this._messages.push(item);
            }
            else {
                notValidMessages.push(item);
            }
        });
        return notValidMessages;
    }

    //delete all messages
    clear() {
        this._messages = [];
    }

}

class UserList {
    constructor(users, activeUsers) {
        this.users = users;
        this.activeUsers = activeUsers;
    }
}

class HeaderView {
    constructor(elementId) {
        this.elementId = elementId; 
    }

    display(user) {
        if(user !== undefined){
            document.getElementById(this.elementId).innerHTML = user;
        }
    }
}

class ActiveUsersView {
    constructor(elementId) {
        this.elementId = elementId; 
    }

    display(activeUsers) {
        const activeUsersList = document.getElementById(this.elementId);
        const innerHTML = activeUsers.map(user => 
            `<li>${user}</li>`
            ).join(`\n`);
        activeUsersList.innerHTML = innerHTML;
    }
}

class MessagesView {
    constructor(elementId) {
        this.elementId = elementId; 
    }

    display(msgsArray) {
        const messagesList = document.getElementById(this.elementId);
        messagesList.innerHTML = msgsArray.map(msg => {
            let d = [
                '0' + msg.createdAt.getDate(),
                '0' + (msg.createdAt.getMonth() + 1),
                '0' + msg.createdAt.getHours(),
                '0' + msg.createdAt.getMinutes()
            ].map(item => item.slice(-2));
            let date = ' ' + d[0] + '.' + d[1] + '.' + msg.createdAt.getFullYear() + ' ' 
                + d[2] + ':' + d[3];
            let to = '';
            if (msg.to) {
                to = '  >>  ' + msg.to;
            }
            if (msg.author !== messageList.user) {
                return `<div class="message them-message">
                    <div class="message-data">
                    <span class="author">${msg.author}</span>
                    <span class="target">${to}</span>
                    <span class="date">${date}</span>
                    </div>
                    <div class="message-text them-message-colour">${msg.text}
                    </div>
                </div>`
            }
            else {
                return `<div class="message us-message">
                    <div class="message-data">
                    <span class="author">${msg.author}</span>
                    <span class="target">${to}</span>
                    <span class="date">${date}</span>
                    </div>
                    <div class="message-text us-message-colour">${msg.text}
                    </div>
                </div>`
                
            }
        }).join(`\n`);
    }

}


function setCurrentUser(user) {
    messageList.user = user;
    headerView.display(user);
}

function showActiveUsers() {
    activeUsersView.display(userList.activeUsers);
}

function showMessages(skip, top, filterConfig) {
    let msgsViewed = messageList.getPage(skip, top, filterConfig);
    messagesView.display(msgsViewed);
}

function addMessage(msg) {
    if(messageList.add(msg)){
        showMessages(0, 10);
    }

}

function editMessage(id, msg) {
    if(messageList.edit(id, msg)){
        showMessages(0, 10);
    }
}

function removeMessage(id) {
    if(messageList.remove(id)){
        showMessages(0, 10);
    }
}

const userList = new UserList(['Дарт Вейдер', 'Dima', 'Zhenya Zh.', 'Zhenya H.', 'Sasha', 'Pasha'], ['Dima', 'Zhenya Zh.', 'Дарт Вейдер']);

const messageList = new MessageList([
    {
        id: '1',
        text: 'Lorem Ipsum - это текст-"рыба", часто используемый в печати и вэб-дизайне.',
        createdAt: new Date('2020-10-10T15:35:12'),
        author: 'Чебурашка',
        isPersonal: false
    },
    {
        id: '2',
        text: 'Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum',
        createdAt: new Date('2020-10-10T14:36:00'),
        author: 'Крокодил Гена',
        isPersonal: false
    },
    {
        id: '3',
        text: 'Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн.',
        createdAt: new Date('2020-10-10T14:38:12'),
        author: 'Крокодил Гена',
        isPersonal: false
    },
    {
        id: '4',
        text: 'Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах',
        createdAt: new Date('2020-10-10T14:40:56'),
        author: 'Лиза',
        isPersonal: false
    },
    {
        id: '5',
        text: 'в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.',
        createdAt: new Date('2020-10-10T14:50:01'),
        author: 'Стас Верхов',
        isPersonal: false
    },
    {
        id: '6',
        text: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.',
        createdAt: new Date('2020-10-10T14:55:55'),
        author: 'Дарт Вейдер',
        isPersonal: false
    },
    {
        id: '7',
        text: 'Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона',
        createdAt: new Date('2020-09-10T14:58:06'),
        author: 'Дарт Вейдер',
        isPersonal: false
    },
    {
        id: '8',
        text: 'Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию',
        createdAt: new Date('2020-10-10T15:03:06'),
        author: 'Настя Лещинская',
        isPersonal: false
    },
    {
        id: '9',
        text: 'За прошедшие годы текст Lorem Ipsum получил много версий.',
        createdAt: new Date('2020-10-10T15:07:16'),
        author: 'Вика Смехова',
        isPersonal: false
    },
    {
        id: '10',
        text: 'Некоторые версии появились по ошибке, некоторые - намеренно (например, юмористические варианты).',
        createdAt: new Date('2020-10-10T15:15:15'),
        author: 'Дарт Вейдер',
        isPersonal: true,
        to: 'Стас Верхов'
    },
    {
        id: '11',
        text: 'Многие думают, что Lorem Ipsum - взятый с потолка псевдо-латинский набор слов, но это не совсем так.',
        createdAt: new Date('2020-10-12T16:18:23'),
        author: 'Стас Верхов',
        isPersonal: true,
        to: 'Дарт Вейдер',
    },
    {
        id: '12',
        text: 'Его корни уходят в один фрагмент классической латыни 45 года н.э., то есть более двух тысячелетий назад.',
        createdAt: new Date('2020-10-11T01:02:02'),
        author: 'Лиза',
        isPersonal: false
    },
    {
        id: '13',
        text: 'Классический текст Lorem Ipsum, используемый с XVI века, приведён ниже. ',
        createdAt: new Date('2020-10-11T02:01:03'),
        author: 'Вика Смехова',
        isPersonal: false
    },
    {
        id: '14',
        text: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться.',
        createdAt: new Date('2020-10-11T05:04:06'),
        author: 'Крокодил Гена',
        isPersonal: false
    },
    {
        id: '15',
        text: 'Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию',
        createdAt: new Date('2020-10-12T16:15:57'),
        author: 'Чебурашка',
        isPersonal: true,
        to: 'Крокодил Гена'
    },
    {
        id: '16',
        text: 'так что поиск по ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рождения.',
        createdAt: new Date('2020-10-12T16:18:57'),
        author: 'Крокодил Гена',
        isPersonal: false
    },
    {
        id: '17',
        text: 'Есть много вариантов Lorem Ipsum, но большинство из них имеет не всегда приемлемые модификации, например, юмористические вставки или слова, которые даже отдалённо не напоминают латынь.',
        createdAt: new Date('2020-10-12T16:20:37'),
        author: 'Дарт Вейдер',
        isPersonal: false
    },
    {
        id: '18',
        text: 'Если вам нужен Lorem Ipsum для серьёзного проекта, вы наверняка не хотите какой-нибудь шутки, скрытой в середине абзаца.',
        createdAt: new Date('2020-10-12T16:26:57'),
        author: 'Настя Лещинская',
        isPersonal: false
    },
    {
        id: '19',
        text: 'Также все другие известные генераторы Lorem Ipsum используют один и тот же текст, который они просто повторяют, пока не достигнут нужный объём.',
        createdAt: new Date('2020-10-25T17:34:57'),
        author: 'Дарт Вейдер',
        isPersonal: true,
        to: 'Лиза'
    },
    {
        id: '20',
        text: 'Это делает предлагаемый здесь генератор единственным настоящим Lorem Ipsum генератором. Он использует словарь из более чем 200 латинских слов, а также набор моделей предложений.',
        createdAt: new Date('2020-10-12T18:15:17'),
        author: 'Лиза',
        isPersonal: true,
        to: 'Дарт Вейдер'
    }
    ]); 


const headerView = new HeaderView('user-name');

const messagesView = new MessagesView('messages');

const activeUsersView = new ActiveUsersView('users-online-list');


setCurrentUser('Дарт Вейдер');

showActiveUsers();

showMessages(0, 10);

addMessage({text: 'Это сообщение было добавлено!!!'});

editMessage('19', {text: 'Это сообщение было изменено!!!'});

removeMessage('17');

