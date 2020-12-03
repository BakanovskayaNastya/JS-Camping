class Message {
    constructor(user, msg) {
        this._id = msg.id || `${new Date()}`;
        if(msg.createdAt) {
            this._createdAt = new Date(msg.createdAt);
        }
        else {
            this._createdAt = new Date();
        }
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
    
    constructor() {
        this._user = localStorage.getItem("user") || undefined;
        const msgs = this.restore();
        this._messages = [];
        msgs.forEach(item => {
            this._messages.push(new Message(this.user, item));
        });
    }

    get user() {
        return localStorage.getItem("user") || undefined;
    }

    set user(user) {
        this._user = user;
    }

    get messages() {
        return this._messages;
//        return JSON.parse(localStorage.getItem('messages') ?? '[]');
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

    save() {
        localStorage.setItem("messages",  JSON.stringify(this.messages));
    }

    restore() {
        return JSON.parse(localStorage.getItem('messages') ?? '[]');
    }
    //messages
    getPage(skip = 0, top = 10, filterConfig) {
        let result = this.messages.slice();

        result = result.filter(item => {
            if(item.author === this.user || item.isPersonal === false || (item.isPersonal === true && item.to === this.user)) {
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
        let message = this.messages.find(item => item.id === id);
        if (message && message.author === this.user) {
            return message;
        }
        return null;
    }

    //addMessage
    add(msg) {
        let message = new Message(this.user, msg);
        if(MessageList.validate(message)){
            this.messages.push(message);
            this.save();
            return true;
        }
        return false;
    }

    //editMessage
    edit(id, msg) {
        let index = this.messages.findIndex(item => item.id === id);
        if (index !== -1 && this.messages[index].author === this.user) {
            let newMessage = new Message(id, msg);
            if(MessageList.validate(newMessage)) {
                if (msg.text) {
                    this.messages[index].text = newMessage.text;
                }
                if (msg.isPersonal) {
                    this.messages[index].isPersonal = newMessage.isPersonal;
                }
                if (msg.to && msg.isPersonal) {
                    this.messages[index].to = newMessage.to;
                }
                this.save();
                return true;
            }
        }
        
        return false;
    }

    //removeMessage
    remove(id) {
        let index = this.messages.findIndex(item => item.id === id);
        if (index !== -1 && this.messages[index].author === this.user) {
            let messageDeleted = this.messages.splice(index, 1);
            this.save();
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
                this.messages.push(item);
            }
            else {
                notValidMessages.push(item);
            }
        });
        this.save();
        return notValidMessages;
    }

    //delete all messages
    clear() {
        this.messages = [];
        this.save();
    }

}

class UserList {
    constructor(users, activeUsers) {
        this.restore();
    }

    addUser(user) {
        this.users.push(user);
        this.activeUsers.push(user);
        this.save();
    }

    save() {
        localStorage.setItem("usersList",  JSON.stringify(this.users));
        localStorage.setItem("activeUsersList",  JSON.stringify(this.activeUsers));
    }

    restore() {
        this.users = JSON.parse(localStorage.getItem('usersList') ?? '[]');
        this.activeUsers = JSON.parse(localStorage.getItem('activeUsersList') ?? '[]');
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
            document.getElementById('login-button').setAttribute(`src`, `images/login.png`);
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
        this._user = localStorage.getItem("user") || undefined;
        this.elementId = elementId; 
    }

    get user() {
        return localStorage.getItem("user") || undefined;
    }

    set user(user) {
        this._user = user;
    }

    display(msgsArray) {
        const messagesList = document.getElementById(this.elementId);
        messagesList.innerHTML = msgsArray.map(msg => {
            let date = this._formateDate(msg.createdAt);
            let to = '';
            if (msg.to) {
                to = '  >>  ' + msg.to;
            }
            if (msg.author !== this.user) {
                return `<div class="message them-message" id="${msg.id}">
                        <div class="message-data">
                        <span class="author">${msg.author}</span>
                        <span class="target">${to}</span>
                        <span class="date">${date}</span>
                        </div>
                        <div class="message-text them-message-colour">${msg.text}
                        </div>
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
/*
class UserService {
    constructor() {
        this._user = localStorage.getItem("user") || undefined;
    }
    
    get user() {
        return this._user;
    }

    set user(user) {
        this._user = user;
    }
}
*/
class Controller {
    constructor() {
//        this.user = new UserService();
        this._user = localStorage.getItem("user") || undefined;
        this._numberOfMessagesShown = 0;
        this.userList = new UserList();
        this.headerView = new HeaderView('user-name');
        this.messagesView = new MessagesView('messages');
        this.activeUsersView = new ActiveUsersView('users-online-list');
        this.messageList = new MessageList();
     
        const loginButton = document.getElementById("login-button");
        loginButton.addEventListener('click', this.moveToLoginPage);
        const usersOnlineButton = document.getElementById("users-online-button");
        usersOnlineButton.addEventListener('click', this.showUsersOnlinePanel);
        const filtersButton = document.getElementById("filters-button");
        filtersButton.addEventListener('click', this.showFilterPanel);
        const loadMoreMessagesButton = document.getElementById("load-more-messages");
        loadMoreMessagesButton.addEventListener('click', () => {this.loadMoreMessages()});
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            this.showContextOptions(event);
        });
    }

    get user() {
        return this._user;
    }

    set user(user) {
        this._user = user;
    }

    get numberOfMessagesShown() {
        return this._numberOfMessagesShown;
    }

    set numberOfMessagesShown(num) {
        this._numberOfMessagesShown = num;
    }

    init() {
        this.setCurrentUser(this.user);
        this.showActiveUsers(this.userList);
        this.showMessages();
        this.returnToChatPage();
    }

    setCurrentUser(user) {
        this.user = user;
        this.headerView.display(user);
    }

    showActiveUsers() {
        this.activeUsersView.display(this.userList.activeUsers);
    }

    showMessages(skip = 0, top = 10, filterConfig = {}) {
        const msgsViewed = this.messageList.getPage(skip, top, filterConfig);
        this.messagesView.display(msgsViewed);
        this.numberOfMessagesShown = top;
    }

    addMessage(msg) {
        if(this.messageList.add(msg)){
            this.showMessages();
            return true;
        }
        return false;
    }

    editMessage(id, msg) {
        if(this.messageList.edit(id, msg)){
            this.showMessages();
            return true;
        }
        return false;
    }
    
    removeMessage(id) {
        if(this.messageList.remove(id)){
            this.showMessages();
        }
    }

    login(user) {
    const regButton = document.getElementById("reg-button");
    regButton.addEventListener('click', this.moveToRegisterPage);
    const returnToChatButton = document.getElementById("return-to-chat");
    returnToChatButton.addEventListener('click', this.returnToChatPage);

        if(this.userList.users.includes(user)) {
            localStorage.setItem("user", user);
            this.setCurrentUser(user);
            this.showMessages();
            this.returnToChatPage();
        }
        else {
            document.getElementById("auto-error-message").style.display = "inline";
        }
        
    }

    register(user) {
        const returnToChatButtonAlt = document.getElementById("return-to-chat-alt");
        returnToChatButtonAlt.addEventListener('click', this.returnToChatPage);


        this.setCurrentUser(user);
        this.showMessages();
        this.numberOfMessagesShown = 10;
        this.userList.addUser(user);
        this.showActiveUsers(this.userList);
        this.returnToChatPage();
    }

    sendMessage(event) {
        let msgId = document.getElementById('msg-id').innerHTML;
        let msgTo = event.srcElement[0].value;
        let msgText = event.srcElement[1].value;
        let msg= {};
        if(msgTo !== "") {
            msg = {text: msgText, isPersonal: true, to: msgTo};
        }
        else {
            msg = {text: msgText, isPersonal: false};
        }
        if(!msgId || msgId === 'undefined') {
            if(this.addMessage(msg)) {
                document.getElementById("msg-text").value = "";
                document.getElementById("msg-to").value = "";
            }
        }
        else {
            if(this.editMessage(msgId, msg)) {
                document.getElementById('msg-id').innerHTML = undefined;
                document.getElementById("msg-text").value = "";
                document.getElementById("msg-to").value = "";
            }
        }
        
    }

    loadMoreMessages() {
        let number = this.numberOfMessagesShown + 10
        this.showMessages(0, number);
        this.numberOfMessagesShown = number;
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
        document.getElementById('auto-error-message').style.display = "none";
        document.getElementById('autorization-module').style.display = "flex";
        localStorage.removeItem("user");
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

    showContextOptions(event) {
        let parentElem = event.target.parentElement;
        if(parentElem.className !== 'message us-message' && parentElem.className !== 'messages') {
            console.log(parentElem.className);
            parentElem = parentElem.parentElement;
        }
        if (parentElem.className === 'messages') {
            return;
        }

        const id = parentElem.id;
        let messageElem = document.getElementById(id);
        messageElem.innerHTML += `<div class="context-menu" id="context-menu">
                            <ul class="context-menu-items">
                                <li class="context-menu-item" id="edit-msg">Edit</li>
                                <li class="context-menu-item" id="delete-msg">Delete</li>
                            </ul>
                        </div>`;

        let contextMenu = document.getElementById('context-menu');
        contextMenu.style.display = 'block';
        contextMenu.style.transform = 'translate(0%, -100%)';
        let editButton = document.getElementById('edit-msg');
        editButton.addEventListener('click', () => {
            contextMenu.parentNode.removeChild(contextMenu);
            const msg = this.messageList.get(id);
            document.getElementById('msg-id').innerHTML = msg.id;
            document.getElementById('msg-text').value = msg.text;
            if(msg.to) {
                document.getElementById('msg-to').value = msg.to;
            }
        });
        let deleteButton = document.getElementById('delete-msg');
        deleteButton.addEventListener('click', () => {
            contextMenu.parentNode.removeChild(contextMenu);
            this.removeMessage(id);
        });
        document.addEventListener('click', function() {
            if(document.getElementById('context-menu')) {
                let menu = document.getElementById('context-menu');
                menu.parentNode.removeChild(document.getElementById('context-menu'));
            }
        });
    }
}

let messageList = [
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
    }];

function fillLocalCtorage() {
    localStorage.setItem("messages", JSON.stringify(messageList));
    localStorage.setItem("usersList", JSON.stringify(['Дарт Вейдер', 'Dima', 'Zhenya Zh.', 'Zhenya H.', 'Sasha', 'Pasha']));
    localStorage.setItem("activeUsersList", JSON.stringify(['Dima', 'Zhenya Zh.', 'Дарт Вейдер']));
}

fillLocalCtorage();

const controller = new Controller();
controller.init();









/*
const rightMouseClick = document.querySelector(".us-message");
rightMouseClick.addEventListener('click', function(event){
    console.log(event);
})
*/