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

    addUser(user) {
        this.users.push(user);
        this.activeUsers.push(user);
    }
}

class HeaderView {
    constructor(elementId) {
        this.elementId = elementId; 
    }

    display(user) {
        if(user !== undefined) {
            document.getElementById(this.elementId).innerHTML = user;
            document.getElementById('login-button').setAttribute(`src`, `images/logout.png`);
            document.getElementById("input-message").innerHTML = `<textarea name="write-message" name="msg-text" id="msg-text" ></textarea>
            <input type="submit" alt="send message"  />`;
        }
        else {
            document.getElementById(this.elementId).innerHTML = '';
            document.getElementById("input-message").innerHTML = `<textarea name="write-message" name="msg-text" id="msg-text" disabled></textarea>
            <input type="submit" alt="send message" disabled />`;
            document.getElementById('login-button').setAttribute(`src`, `images/logout.png`);
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
            let date = this._formateDate(msg.createdAt);
            let to = '';
            if (msg.to) {
                to = '  >>  ' + msg.to;
            }
            if (msg.author !== messageList.user) {
                return `<div class="message them-message" id="${msg.id}">
                    <div>
                        <div class="message-data">
                        <span class="author">${msg.author}</span>
                        <span class="target">${to}</span>
                        <span class="date">${date}</span>
                        </div>
                        <div class="message-text them-message-colour">${msg.text}
                        </div>
                    </div>
                    <div class="context-menu" id="context-menu">
                        <ul class="context-menu-items">
                            <li class="context-menu-item" id="edit-msg">Edit</li>
                            <li class="context-menu-item" id="delete-msg">Delete</li>
                        </ul>
                    </div>
                </div>`
            }
            else {
                return `<div class="message us-message" id="${msg.id}">
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

    _formateDate(date) {
        let dateOld = [
            '0' + date.getDate(),
            '0' + (date.getMonth() + 1),
            '0' + date.getHours(),
            '0' + date.getMinutes()
        ].map(item => item.slice(-2));
        let dateNew = ' ' + dateOld[0] + '.' + dateOld[1] + '.' + date.getFullYear() + ' ' 
            + dateOld[2] + ':' + dateOld[3];
            return dateNew;
    }

}

class Controller {
    constructor() {
        this.userList = new UserList(['Дарт Вейдер', 'Dima', 'Zhenya Zh.', 'Zhenya H.', 'Sasha', 'Pasha'], ['Dima', 'Zhenya Zh.', 'Дарт Вейдер']);
        this.headerView = new HeaderView('user-name');
        this.messagesView = new MessagesView('messages');
        this.activeUsersView = new ActiveUsersView('users-online-list');
    }

    _numberOfMessagesShown = 0;

    get numberOfMessagesShown() {
        return this._numberOfMessagesShown;
    }

    set numberOfMessagesShown(num) {
        this._numberOfMessagesShown = num;
    }

    setCurrentUser(user) {
        console.log(user);
        messageList.user = user;
        this.headerView.display(user);
    }

    showActiveUsers() {
        this.activeUsersView.display(this.userList.activeUsers);
    }

    showMessages(skip = 0, top = 10, filterConfig = {}) {
        let msgsViewed = messageList.getPage(skip, top, filterConfig);
        this.messagesView.display(msgsViewed);
    }

    addMessage(msg) {
        if(messageList.add(msg)){
            this.showMessages();
            this.numberOfMessagesShown = 10;
            return true;
        }
        return false;
    }

    editMessage(id, msg) {
        if(messageList.edit(id, msg)){
            showMessages();
            this.numberOfMessagesShown = 10;
        }
    }
    
    removeMessage(id) {
        if(messageList.remove(id)){
            showMessages();
            this.numberOfMessagesShown = 10;
        }
    }

    login(user) {
        let check = false;
        let i = 0;
        while (!check && i < this.userList.users.length) {
            if(this.userList.users[i] !== user) {
                i++;
            }
            else {
                check = true;
            }
        }
        if(check) {
            this.setCurrentUser(user);
            this.showMessages();
            this.returnToChatPage();
        }
        else {
            document.getElementById("auto-error-message").style.display = "inline";
        }
        
    }

    register(user) {
        this.setCurrentUser(user);
        this.showMessages();
        this.numberOfMessagesShown = 10;
        this.userList.addUser(user);
        this.showActiveUsers(this.userList);
        this.returnToChatPage();
    }

    sendMessage(event) {
        let msgTo = event.srcElement[0].value;
        let msgText = event.srcElement[1].value;
        let msg={text: msgText, to: msgTo};
        if(this.addMessage(msg)) {
            document.getElementById("msg-text").value = "";
        }
    }

    loadMoreMessages() {
        
    }

    filterMessages(event) {
        let filter = {};
        if (event.target[0].value) {
            filter.author = event.target[0].value;
        }
        
        if (event.target[1].value) {
            filter.dateFrom = new Date(event.target[1].value);
        }
        if (event.target[2].value) {
           filter.dateTo = new Date(event.target[2].value);
        }
        if (event.target[3].value) {
            filter.text = event.target[3].value;
         }
        this.showMessages(0, 10, filter);
        this.numberOfMessagesShown = 10;
    }

    moveToLoginPage() {
        document.getElementById('user-status').style.display = "none";
        document.getElementById('chat-module').style.display = "none";
        document.getElementById('registration-module').style.display = "none";
        document.getElementById('autorization-module').style.display = "flex";
        
    }
    
    moveToRegisterPage() {
        document.getElementById('user-status').style.display = "none";
        document.getElementById('chat-module').style.display = "none";
        document.getElementById('autorization-module').style.display = "none";
        document.getElementById('registration-module').style.display = "flex";
    } 

    returnToChatPage() {
        document.getElementById('autorization-module').style.display = "none";
        document.getElementById('registration-module').style.display = "none";
        document.getElementById('user-status').style.display = "flex";
        document.getElementById('chat-module').style.display = "flex";
    }

    showUsersOnlinePanel() {
        document.getElementById("filters-panel").style.display = 'none';
        document.getElementById("users-online-panel").style.display = 'block';
    }

    showFilterPanel() {
        document.getElementById("users-online-panel").style.display = 'none';
        document.getElementById("filters-panel").style.display = 'block';
    }

}

// test data
//const userList = new UserList(['Дарт Вейдер', 'Dima', 'Zhenya Zh.', 'Zhenya H.', 'Sasha', 'Pasha'], ['Dima', 'Zhenya Zh.', 'Дарт Вейдер']);
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

const controller = new Controller();
controller.showActiveUsers(this.userList);
controller.showMessages();
controller.numberOfMessagesShown = 10;



const loginButton = document.getElementById("login-button");
loginButton.addEventListener('click', controller.moveToLoginPage);

const regButton = document.getElementById("reg-button");
regButton.addEventListener('click', controller.moveToRegisterPage);

const returnToChatButton = document.getElementById("return-to-chat");
returnToChatButton.addEventListener('click', controller.returnToChatPage);

const returnToChatButtonAlt = document.getElementById("return-to-chat-alt");
returnToChatButtonAlt.addEventListener('click', controller.returnToChat);

const usersOnlineButton = document.getElementById("users-online-button");
usersOnlineButton.addEventListener('click', controller.showUsersOnlinePanel);

const filtersButton = document.getElementById("filters-button");
filtersButton.addEventListener('click', controller.showFilterPanel);

const loadMoreMessagesButton = document.getElementById("load-more-messages");
loadMoreMessagesButton.addEventListener('click', controller.loadMoreMessages);
/*
const rightMouseClick = document.getElementById("messages");
rightMouseClick.addEventListener('contextmenu', alert("olllaaaa"));
*/