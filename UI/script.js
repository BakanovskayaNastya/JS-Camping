const messages = [
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
        author: 'Настя Лещинская',
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
];

const functions = (function(){

    function getMessages(skip = 0, top = 10, filterConfig) {
        messages.sort( (a, b) => {
            return a.createdAt - b.createdAt;
        });
        let result = messages.slice();
        if (filterConfig) {
            if (filterConfig.author) {
                for (let i = 0; i < result.length; i++) {
                    if (!result[i].author.includes(filterConfig.author)) {
                        result.splice(i, 1);
                        i--;
                    }
                }
            }
            if (filterConfig.text) {
                for (let i = 0; i < result.length; i++) {
                    if (!result[i].text.includes(filterConfig.text)) {
                        result.splice(i, 1);
                        i--;
                    }
                }
            }
            if (filterConfig.dateFrom && filterConfig.dateTo) {
                for (let i = 0; i < result.length; i++) {
                    if (!((result[i].createdAt - filterConfig.dateFrom) > 0 && ((filterConfig.dateTo - result[i].createdAt) > 0))) {
                        result.splice(i, 1);
                        i--;
                    }
                }
            }
        }
        return result.splice(skip, top);
    }
    
    function getMessage(id) {
        let message = messages.find(item => item.id === id);
        if (message) {
            return message;
        }
        return null;
    }

    function validateMessage(msg) {
        if (msg.id && typeof(msg.id) !== "string") {
            return false;
        }
        if (msg.text && typeof(msg.text) !== "string") {
            return false;
        }
        if (msg.author && typeof(msg.author) !== "string") {
            return false;
        } 
        if (msg.createdAt && Object.prototype.toString.call(msg.createdAt) !== '[object Date]') {
            return false;
        }
        if (msg.isPersonal && typeof(msg.isPersonal) !== "boolean") {
            return false;
        }
        if (msg.to) {
            if(msg.isPersonal === true && typeof(msg.to) !== "string") {
                return false;
            }
        }
        return true;
    }

    function addMessage(msg) {
        if(validateMessage(msg)){
            messages.push(msg);
            return true;
        }
        return false;
    }

    function editMessage(id, message) {
        if(validateMessage(message)){
            let index = messages.findIndex(item => item.id === id);
            if (index !== -1) {
                if (message.text) {
                    messages[index].text = message.text;
                }
                if (message.isPersonal) {
                    messages[index].isPersonal = message.isPersonal;
                }
                if (message.to && message.isPersonal) {
                    messages[index].to = message.to;
                }
            }
            return true;
        }
        return false;
    }

    function removeMessage(id) {
        let index = messages.findIndex(message => message.id === id);
        if (index !== -1) {
            let messageDeleted = messages.splice(index, 1);
            if (messageDeleted.length === 1) {
                return true;
            }
        }
        return false;
    }

    return {getMessages, getMessage, validateMessage, addMessage, editMessage, removeMessage};
})();


// checking for the correct work of module

// function getMessages(skip = 0, top = 10, filterConfig)
console.log('getMessages(skip = 0, top = 10, filterConfig) function');
console.log('First 10 messages ', functions.getMessages(0, 10));
console.log('Second 10 messages ', functions.getMessages(10, 10));
console.log("Messages of users with 'Лиза' substr in author", functions.getMessages(0, 10, {author: 'Лиза'}));
console.log("Messages of users with 'Дарт' substr in author: ", functions.getMessages(0, 10, {author: 'Дарт'}));
console.log("Messages of users with 'Дарт ' substr in author and 'Lorem Ipsum' in text: ", functions.getMessages(0, 10, {author: 'Дарт', text: 'Lorem Ipsum'}));
console.log("Messages of users with 'Дарт ' substr in author and 'Lorem Ipsum' in text: ", functions.getMessages(0, 10, {
    text: 'Lorem Ipsum',
    dateFrom: new Date('2020-10-11T18:15:17'),
    dateTo: new Date(),
    author: 'Дарт'
}));

// function getMessage(id)
console.log('');
console.log('getMessage(id) function');
console.log("Message with id='1'", functions.getMessage('1'));
console.log("Message with id='6'", functions.getMessage('6'));
console.log("There is no message with id='125'", functions.getMessage('125'));
console.log("Message id is a number (not valid)", functions.getMessage(1));

// function validateMessage(msg)
console.log('');
console.log('validateMessage(msg) function');
console.log("Correct message: ", functions.validateMessage(messages[5]));
console.log("Correct message: ", functions.validateMessage(messages[17]));
console.log("Wrong message (id is a number):", functions.validateMessage({
    id: 20,
    text: 'bla-bla',
    createdAt: new Date('2020-10-12T18:15:17'),
    author: 'Лиза',
    isPersonal: true,
    to: 'Дарт Вейдер'
}));
console.log("Wrong message ('to' field is a number):", functions.validateMessage({
    id: '20',
    text: 'Bla-bla',
    createdAt: new Date('2020-10-12T18:15:17'),
    author: 'Лиза',
    isPersonal: true,
    to: 20
}));
console.log("Wrong message (text is a number):", functions.validateMessage({
    id: '1',
    text: 123,
    createdAt: new Date('2020-10-12T18:15:17'),
    author: 'Лиза',
    isPersonal: false
}));
console.log("Wrong message (wrong date):", functions.validateMessage({
    id: '1',
    text: '123',
    createdAt: 'asd',
    author: 'Лиза',
    isPersonal: false
}));
console.log("Wrong message (author is a number): ", functions.validateMessage({
    id: '1',
    text: '123',
    createdAt: new Date('2020-10-12T18:15:17'),
    author: 145,
    isPersonal: false
}));

// function addMessage(msg)
console.log('');
console.log('addMessage(msg) function');
console.log("Add correct message: ", functions.addMessage({
    id: '28',
    text: 'Всем привет.',
    createdAt: new Date('2020-10-12T18:15:17'),
    author: 'Лиза',
    isPersonal: true,
    to: 'Дарт Вейдер'
}));
console.log("Add wrong message: ", functions.addMessage({
    id: '1',
    text: '123',
    createdAt: new Date('2020-10-12T18:15:17'),
    author: 145,
    isPersonal: false
}));

// function editMessage(id, message)
console.log('');
console.log('editMessage(id, message) function');
console.log("Edit message with incomplete message object (there is only text field in it): ",functions.editMessage('1', { text: 'hi' }));
console.log("Edit message with valid message: ", functions.editMessage("18", {
    id: '28',
    text: 'Всем привет.',
    createdAt: new Date('2020-10-12T18:15:17'),
    author: 'Лиза',
    isPersonal: true,
    to: 'Дарт Вейдер'
}));
console.log("Edit message with invalid message (author is a number): ", functions.editMessage("5", {
    id: '1',
    text: '123',
    createdAt: new Date('2020-10-12T18:15:17'),
    author: 145,
    isPersonal: false
}));

//function removeMessage(id)
console.log('');
console.log('removeMessage(id) function');
console.log("Remove message with id='1': ", functions.removeMessage('1'));
console.log("Remove message with id='2': ", functions.removeMessage('2'));
console.log("Remove message with id='11': ", functions.removeMessage('11'));
console.log("Remove message with id='12: ", functions.removeMessage('12'));
console.log("Remove message with id='12' (it was removed earlier): ", functions.removeMessage('12'));
console.log("Remove message with id='1' (no message with such an id): ", functions.removeMessage('asd'));
console.log("Remove message with id=3 (invalid id): ", functions.removeMessage(3));
console.log("Messages without removed ones")
messages.forEach(message => {
    console.log(message.id);
});