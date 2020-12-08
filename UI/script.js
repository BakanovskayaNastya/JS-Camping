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

class HeaderView {
    constructor(elementId) {
        this.elementId = elementId; 
    }

    display(user) {
        if(user) {
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
        return ;
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
        return ;
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
 
class ChatApiService {
    constructor(serverURL) {
        this._serverURL = serverURL;
    }

    set serverURL(serverURL) {
        this._serverURL = serverURL;
    }

    get serverURL() {
        return this._serverURL;
    }

    requestServerBool(url, obj) {
        return fetch(url, obj)
        .then((response) => {
            if(response.status === 200 || response.status === 201) {
                return {
                    status: response.status,
                    result: true
                }
            }
            else {
                return {
                    status: response.status,
                    result: false
                }
            }
        });
    }

    getMessages(skip = 0, top = 10, filterConfig) {
        let url = `${this.serverURL}/messages?skip=${skip}&top=${top}`;
        if(filterConfig) {
            const urlParams = Object.entries(filterConfig);
            urlParams.forEach(item => {
                url += `&${item[0]}=${item[1]}`;
            });
        }
        let params = {};
        if(localStorage.getItem("token")) {
            params = {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "content-type": "application/json"
                },
            }
        }
        return  fetch(url, params)
        .then((response) => {
            return {
                status: response.status,
                result: response.json()
            }
        });
    }

    getUsers() {
        const url = `${this.serverURL}/users`;
        return fetch(url)
        .then((response) => {
            return {
                status: response.status,
                result: response.json()
            }
        });
    }

    login(formdata) {
        const url = `${this.serverURL}/auth/login`;
        return fetch(url, {
            method: 'POST',
            body: formdata
        })
        .then((response) => {
            return {
                status: response.status,
                result: response.json()
            }
        });
    }

    logout() {
        const url = `${this.serverURL}/auth/logout`;
        const params = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            }
        };
        return this.requestServerBool(url, params);
    }

    register(formdata) {
        const url = `${this.serverURL}/auth/register`;
        return fetch(url, {
            method: 'POST',
            body: formdata
        });
    }

    addMessage(msg) {
        const url = `${this.serverURL}/messages`;
        const params = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "content-type": "application/json"
            },
            body: JSON.stringify(msg)
        };
        return this.requestServerBool(url, params);
    }

    editMessage(id, msg) {
        const url = `${this.serverURL}/messages/${id}`;
        const params = {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "content-type": "application/json"
            },
            body: JSON.stringify(msg)
        };
        return this.requestServerBool(url, params);
    }

    deleteMessage(id) {
        const url = `${this.serverURL}/messages/${id}`;
        const params = {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        };
        return this.requestServerBool(url, params);
    }
    
}

class Controller {
    constructor() {
        this.chatApiService = new ChatApiService('https://jslabdb.datamola.com');
        this._messages = null;
        this._numberOfMessagesShown = 0;
        this._messageTimeout = null;
        this._usersTimeout = null;
//        this.userList = new UserList();
        this.headerView = new HeaderView('user-name');
        this.messagesView = new MessagesView('messages');
        this.activeUsersView = new ActiveUsersView('users-online-list');
//        this.messageList = new MessageList();
     
        const loginButton = document.getElementById("login-button");
        loginButton.addEventListener('click', () => {
            
            if(localStorage.getItem("user")){
                this.logout();
            }
            else {
                this.goToLoginPage();
            }
        });
        const usersOnlineButton = document.getElementById("users-online-button");
        usersOnlineButton.addEventListener('click', () => {
            this.showUsersOnlinePanel;
        });
        const filtersButton = document.getElementById("filters-button");
        filtersButton.addEventListener('click', () => {
            this.showFilterPanel();
        });
        const loadMoreMessagesButton = document.getElementById("load-more-messages");
        loadMoreMessagesButton.addEventListener('click', () => {
            this.loadMoreMessages();
        });
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            this.showContextOptions(event);
        });
    }

    get messages() {
        return this._messages;
    }

    set messages(msgs) {
        this._messages = msgs;
    }

    get numberOfMessagesShown() {
        return this._numberOfMessagesShown;
    }

    set numberOfMessagesShown(num) {
        this._numberOfMessagesShown = num;
    }

    
    set messageTimeout(messageTimeout){
        this._messageTimeout = messageTimeout;
    }

    get messageTimeout() {
        return this._messageTimeout;
    }

    set usersTimeout(usersTimeout) {
        this._usersTimeout = usersTimeout;
    }

    get usersTimeout() {
        return this._usersTimeout;
    }

    init() {
        this.setCurrentUser();
        this.showActiveUsers();
        this.showMessages();
        this.showChatPage();
    }

    setCurrentUser() {
        this.headerView.display(localStorage.getItem("user"));
    }

    showActiveUsers() {
        if(this.usersTimeout) {
            clearTimeout(this.usersTimeout);
        }
        this.chatApiService.getUsers()
        .then(response => {
            return this.processResponse(response);
        })
        .then((data) => {
            return data.filter(user => user.isActive).map(user => user.name)
        })
        .then((activeUsers) => {
            this.activeUsersView.display(activeUsers);
            this.messageTimeout = setTimeout(() => {
                this.showActiveUsers();
            }, 5000);
        });
    }

    showMessages(skip = 0, top = 10, filterConfig = {}) {
        if(this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }
        this.chatApiService.getMessages(skip, top, filterConfig)
        .then(response => {
            return this.processResponse(response);
        })
        .then((data) => {
            return data.map(message => {
                if(message.isPersonal) {
                    return new Message(this.user, {
                        id: message.id,
                        createdAt: message.createdAt,
                        author: message.author,
                        text: message.text,
                        isPersonal: message.isPersonal,
                        to: message.to
                    });
                }
                return new Message(this.user, {
                        id: message.id,
                        createdAt: message.createdAt,
                        author: message.author,
                        text: message.text,
                        isPersonal: message.isPersonal
                });
            });
        })
        .then((msgsViewed) => {

            this.messages = msgsViewed;
            this.messagesView.display(msgsViewed.reverse());
            this.numberOfMessagesShown = top;
            this.messageTimeout = setTimeout(() => {
                this.showMessages(skip, top, filterConfig);
            }, 60000);
        });
    }

    addMessage(msg) {
        this.chatApiService.addMessage(msg)
        .then(response => {
            return this.processResponse(response);
        })
        .then((result) => {
            if(result) {
                this.showMessages();
                return true;
            }
            return false;
        });
    }

    editMessage(id, msg) {
        this.chatApiService.editMessage(id, msg)
        .then(response => {
            return this.processResponse(response);
        })
        .then((result) => {
            if(result) {
                this.showMessages();
                return true;
            }
            return false;
        });
    }
    
    removeMessage(id) {
        this.chatApiService.deleteMessage(id)
        .then(response => {
            return this.processResponse(response);
        })
        .then((result) => {
            if(result) {
                this.showMessages();
                return true;
            }
            return false;
        });
    }

    logout() {
        this.chatApiService.logout()
        .then((response) => {
            return this.processResponse(response);
        })
        .then((result) => {
            if(result) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                this.init();
            }
        })
    }

    login(login, password) {
        let formdata = new FormData();
        formdata.append("name", login);
        formdata.append("pass", password);

        this.chatApiService.login(formdata)
        .then((response) => {
            const token = this.processResponse(response);
            return token;
        })
        .then((response) => {
            localStorage.setItem("user", login);
            localStorage.setItem("token", response.token);
            this.init();
            
        });
    }

    register(login, password, passwordRetyped) {
        if(password !== passwordRetyped){
            document.getElementById("reg-error-message").innerHTML = "Пароли не совпадают. Повторите попытку.";
            document.getElementById("reg-error-message").style.display = "inline";
            return;
        }
        let formdata = new FormData();
        formdata.append("name", login);
        formdata.append("pass", password);

        this.chatApiService.register(formdata)
        .then((data) => {
            if(data.status === 409) {
                document.getElementById("reg-error-message").innerHTML = "Это имя пользователя уже занято. Попробуйте другое";
                document.getElementById("reg-error-message").style.display = "inline";
                return;
            }
            if(data.status === 200) {
                document.getElementById("info-message").style.display = "block";
                document.getElementById("reglogin").style.display = "none";
                document.getElementById("password1").style.display = "none";
                document.getElementById("password2").style.display = "none";
                document.getElementById("registration-button").style.display = "none";
                document.getElementById("registration-label").style.display = "none";
                
            }
            else {
                this.goToErrorPage();
            }
        })
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
            document.getElementById("msg-text").value = "";
            document.getElementById("msg-to").value = "";
            this.addMessage(msg);
        }
        else {
            document.getElementById('msg-id').innerHTML = undefined;
            document.getElementById("msg-text").value = "";
            document.getElementById("msg-to").value = "";
            this.editMessage(msgId, msg);
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
            const date = new Date(event.target[1].value);
            filter.dateFrom = `${date.getFullYear}${date.getMonth+1}${date.getDate}`;
        }
        if (event.target[2].value) {
            const date = new Date(event.target[2].value);
            filter.dateTo =`${date.getFullYear}${date.getMonth+1}${date.getDate}`;
        }
        if (event.target[3].value) {
            filter.text = event.target[3].value;
         }
        this.showMessages(0, 10, filter);
    }

    processResponse(response) {
        if(response.status === 200 || response.status === 201) {
            return response.result;
        }
        if(response.status === 401) {
            this.goToLoginPage();
            document.getElementById("auto-error-message").innerHTML = "Ошибка атворизации. Попробуйте еще раз";
            document.getElementById("auto-error-message").style.display = "inline";
        }
        else {
            if(response.status === 409) {
                document.getElementById("reg-error-message").innerHTML = "Это имя пользователя уже занято. Попробуйте другое";
                document.getElementById("reg-error-message").style.display = "inline";
            }
            else {
                this.goToErrorPage();
            }
        }
    }

    goToLoginPage() {
        document.getElementById('user-status').style.display = "none";
        document.getElementById('chat-module').style.display = "none";
        document.getElementById('error-module').style.display = "none";
        document.getElementById('registration-module').style.display = "none";
        document.getElementById('auto-error-message').style.display = "none";
        document.getElementById('autorization-module').style.display = "flex";

        const regButton = document.getElementById("reg-button");
        regButton.addEventListener('click', () => {
            this.goToRegisterPage();
        });
        const returnToChatButton = document.getElementById("return-to-chat");
        returnToChatButton.addEventListener('click', () => {
            this.init();
        });
    }
    
    goToRegisterPage() {
        document.getElementById('user-status').style.display = "none";
        document.getElementById('chat-module').style.display = "none";
        document.getElementById('error-module').style.display = "none";
        document.getElementById('autorization-module').style.display = "none";
        document.getElementById('registration-module').style.display = "flex";
        const returnToChatButtonAlt = document.getElementById("return-to-chat-alt");
        returnToChatButtonAlt.addEventListener('click', () => {
            this.init();
        });
        const autorizeButton = document.getElementById("go-to-login");
        autorizeButton.addEventListener('click', () => {
            this.goToLoginPage();
        });
    }
    
    goToErrorPage() {
        document.getElementById('user-status').style.display = "none";
        document.getElementById('chat-module').style.display = "none";
        document.getElementById('error-module').style.display = "flex";
        document.getElementById('autorization-module').style.display = "none";
        document.getElementById('registration-module').style.display = "none";
    }
    

    showChatPage() {
        document.getElementById('error-module').style.display = "none";
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
            const msg = this.messages.find((item) => item.id === id);
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

const controller = new Controller();
controller.init();


