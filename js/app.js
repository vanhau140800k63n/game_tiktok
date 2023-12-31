var liveId = 'devsnevn';
var timeoutList = [];
var runIntervalList = [];
var bodyWidth = $('body').width();
var effect = false;

function Animal(id, x, y, person) {
    this.element = $('#animal_' + id);
    this.speed = 10;
    this.x = x;
    this.y = y;
    this.id = id;
    this.author = person;

    this.run = function () {
        var animal = this;
        animal.element.css('top', animal.y + 'px');
        animal.element.css('left', (animal.x - animal.element.width()) + 'px');
        animal.element.append('<div class="name">' + animal.author.name + '</div>')
    }

    this.setAction = function (key) {
        var animal = this;
        var left = parseInt(animal.element.css('left').replace(/[A-Za-z$-]/g, ""));
        animal.element.find('._effect').remove();
        clearTimeout(timeoutList[animal.id]);
        clearInterval(runIntervalList[animal.id]);
        animal.element.append('<img class="_effect" src="effect/attack' + key + '.gif">');

        runIntervalList[animal.id] = setInterval(function () {
            left += 1;
            animal.element.css('left', left + 'px');
        }, 100)

        if (effect == false) {
            effect = true;
            animal.element.css('z-index', 100);
            animal.element.find('._effect').css('z-index', 100);
            $('.cover').show();

            setTimeout(function () {
                animal.element.css('z-index', 10);
                animal.element.find('._effect').css('z-index', 10);
                $('.cover').hide();
                effect = false;
            }, 1000)
        }

        timeoutList[animal.id] = setTimeout(function () {
            animal.element.find('._effect').remove();
            console.log(animal.id);
            clearInterval(runIntervalList[animal.id]);
        }, 5000)
    }
}

class Person {
    name;
    id;

    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}

var animals = [];
var people = [];
var people_id = [];

setInterval(function () {
    if (people[0] != undefined) {
        var person = people.shift();
        $('.mud').append('<div class="animal_gif" id="animal_' + person.id + '"><img class="animal_img" src="animal_img/animal' + (1 + Math.floor(Math.random() * 20)) + '.gif"> </div>');
        var animal = new Animal(person.id, 500 + Math.floor(Math.random() * 1001), 30 * (1 + Math.floor(Math.random() * 10)), person);
        $('#_person_' + person.id).remove();
        animals.push(animal);
        animal.run();
    }
}, 10000)

// setTimeout(function () {
//     var result = people.find(item => item.id == '_nguyenn_tu');
//     console.log(result);
//     console.log(people);
// }, 10000)


var speed_road = 10;
var index_road = 0
var finish_line_length = 3000;

var actions = [1, 2, 3, 4, 5, 6, 7];

$(document).keypress(function (event) {
    var action_id = parseInt(event.key);
    if (actions.includes(action_id)) {
        animals[Math.floor(Math.random() * animals.length)].setAction(action_id);
    }

});

for (i = 1; i <= 20; ++i) {
    $('.list_pet').append('<div class="pet_show"><img src="animal_img/animal' + i + '.gif"><div class="_index">' + i + '</div></div>');
}

for (i = 1; i <= 7; ++i) {
    $('.pet_selector').append('<div class="effect_show"><img src="effect/attack' + i + '.gif"><div class="_index"> Chat "' + i + '" để sử dụng</div></div>');
}
class TikTokIOConnection {
    constructor(backendUrl) {
        this.socket = io(backendUrl);
        this.uniqueId = null;
        this.options = null;

        this.socket.on('connect', () => {
            console.info("Socket connected!");

            if (this.uniqueId) {
                this.setUniqueId();
            }
        })

        this.socket.on('disconnect', () => {
            console.warn("Socket disconnected!");
        })

        this.socket.on('streamEnd', () => {
            console.warn("LIVE has ended!");
            this.uniqueId = null;
        })

        this.socket.on('tiktokDisconnected', (errMsg) => {
            console.warn(errMsg);
            if (errMsg && errMsg.includes('LIVE has ended')) {
                this.uniqueId = null;
            }
        });
    }

    connect(uniqueId, options) {
        this.uniqueId = uniqueId;
        this.options = options || {};

        this.setUniqueId();

        return new Promise((resolve, reject) => {
            this.socket.once('tiktokConnected', resolve);
            this.socket.once('tiktokDisconnected', reject);

            setTimeout(() => {
                reject('Connection Timeout');
            }, 15000)
        })
    }

    setUniqueId() {
        this.socket.emit('setUniqueId', this.uniqueId, this.options);
    }

    on(eventName, eventHandler) {
        this.socket.on(eventName, eventHandler);
    }
}

let backendUrl = location.protocol === 'file:' ? "https://tiktok-chat-reader.zerody.one/" : undefined;
let connection = new TikTokIOConnection(backendUrl);

// Counter
let viewerCount = 0;
let likeCount = 0;
let diamondsCount = 0;

// These settings are defined by obs.html
if (!window.settings) window.settings = {};

$(document).ready(() => {
    connect();
    // if (window.settings.username) connect();
})

function connect() {
    let uniqueId = liveId;
    if (uniqueId !== '') {
        $('#stateText').text('Connecting...');
        connection.connect(uniqueId, {
            enableExtendedGiftInfo: true
        }).then(state => {
            $('#stateText').text(`Connected to roomId ${state.roomId}`);

            // reset stats
            viewerCount = 0;
            likeCount = 0;
            diamondsCount = 0;
            // updateRoomStats();

        }).catch(errorMessage => {
            $('#stateText').text(errorMessage);

            // schedule next try if obs username set
            if (window.settings.username) {
                setTimeout(() => {
                    connect(window.settings.username);
                }, 30000);
            }
        })

    } else {
        alert('no username entered');
    }
}

// Prevent Cross site scripting (XSS)
function sanitize(text) {
    return text;
    return text.replace(/</g, '&lt;')
}

// function updateRoomStats() {
//     $('#roomStats').html(
//         `Viewers: <b>${viewerCount.toLocaleString()}</b> Likes: <b>${likeCount.toLocaleString()}</b> Earned Diamonds: <b>${diamondsCount.toLocaleString()}</b>`
//     )
// }

function generateUsernameLink(data) {

    return `${data.uniqueId.replaceAll('.', '_')}`;
}

function generateNickname(data) {
    return `${data.nickname}`;
}

function isPendingStreak(data) {
    return data.giftType === 1 && !data.repeatEnd;
}

/**
 * Add a new message to the chat container
 */
function addChatItem(color, data, text, summarize) {
    if (text == 'joined') {
        var name = generateNickname(data);
        var id = generateUsernameLink(data);
        $('.noti').html(name + ' đã tham gia vào sảnh chờ');
        if (!people_id.includes(id)) {
            people_id.push(id);
            people.push(new Person(name, id));
            $('.waiting_place ._list').append('<div class="_person" id="_person_' + id + '">' + name + '</div>')
        }
    } else if (text == 'chat') {
        var action_id = parseInt(sanitize(data.comment));
        if (actions.includes(action_id)) {
            animals[Math.floor(Math.random() * animals.length)].setAction(action_id);
            // var id = generateUsernameLink(data);
            // var result = animals.find(item => item.id == id);
            // if (result != undefined && $('#animal_' + id).length > 0) {
            //     result.setAction(action_id);
            // }
        } else {
            var chat = $('<div/>');
            chat.attr('class', 'text_chat');
            chat.html(sanitize(data.comment));
            chat.css('top', Math.floor(Math.random() * 80) + 'px');
            chat.css('left', Math.floor(Math.random() * (bodyWidth - 200)) + 'px');
            $('.audiences').append(chat);

            setTimeout(function () {
                chat.remove();
            }, 10000)
        }
    }

    // if (text == 'joined') {
    //     if ($('#' + generateUsername).length <= 0) {
    //         $('.bar_box').append('<div class="person" id="' + generateUsername + '" style="top:' + Math.floor((minY + (maxY - minY) * Math.random())) + 'px; left: ' + Math.floor((minX + (maxX - minX) * Math.random())) + 'px"> <div class="name">' + generateNickname(data) + '</div> <img class="img_person" src="' + person_img + '" width="' + size + '"> </div>');
    //     } else {
    //         $('#' + generateUsername).show();
    //     }
    //     timeoutArr[generateUsername] = setTimeout(function () {
    //         $('#' + generateUsername).hide();
    //     }, timeout);
    // } else if (text == 'chat') {
    //     if ($('#' + generateUsername).length <= 0) {
    //         $('.bar_box').append('<div class="person" id="' + generateUsername + '" style="top:' + Math.floor((minY + (maxY - minY) * Math.random())) + 'px; left: ' + Math.floor((minX + (maxX - minX) * Math.random())) + 'px"> <div class="name">' + generateNickname(data) + '</div> <div class="text_chat" style="display: block; background-color: #' + Math.floor(Math.random() * 16777215).toString(16) + '">' + sanitize(data.comment) + '</div> <img class="img_person" src="' + person_img + '" width="' + size + '"> </div>');
    //     } else {
    //         $('#' + generateUsername).find('.text_chat').html(sanitize(data.comment));
    //         $('#' + generateUsername).find('.img_person').attr('width', size);
    //         $('#' + generateUsername).show();
    //     }
    //     clearTimeout(timeoutArr[generateUsername]);
    //     timeoutArr[generateUsername] = setTimeout(function () {
    //         $('#' + generateUsername).hide();
    //     }, timeout);
    // }
}

function addGiftItem(data) {
    let container = location.href.includes('obs.html') ? $('.eventcontainer') : $('.giftcontainer');

    if (container.find('div').length > 200) {
        container.find('div').slice(0, 100).remove();
    }

    let streakId = data.userId.toString() + '_' + data.giftId;

    let html = `
    <div data-streakid=${isPendingStreak(data) ? streakId : ''}>
        <img class="miniprofilepicture" src="${data.profilePictureUrl}">
        <span>
            <b>${generateUsernameLink(data)}:</b> <span>${data.describe}</span><br>
            <div>
                <table>
                    <tr>
                        <td><img class="gifticon" src="${data.giftPictureUrl}"></td>
                        <td>
                            <span>Name: <b>${data.giftName}</b> (ID:${data.giftId})<span><br>
                            <span>Repeat: <b style="${isPendingStreak(data) ? 'color:red' : ''}">x${data.repeatCount.toLocaleString()}</b><span><br>
                            <span>Cost: <b>${(data.diamondCount * data.repeatCount).toLocaleString()} Diamonds</b><span>
                        </td>
                    </tr>
                </tabl>
            </div>
        </span>
    </div>
`;

    let existingStreakItem = container.find(`[data-streakid='${streakId}']`);

    if (existingStreakItem.length) {
        existingStreakItem.replaceWith(html);
    } else {
        container.append(html);
    }

    container.stop();
    container.animate({
        scrollTop: container[0].scrollHeight
    }, 800);
}


// viewer stats
// connection.on('roomUser', (msg) => {
//     if (typeof msg.viewerCount === 'number') {
//         viewerCount = msg.viewerCount;
//         updateRoomStats();
//     }
// })

// like stats
// connection.on('like', (msg) => {
//     if (typeof msg.totalLikeCount === 'number') {
//         likeCount = msg.totalLikeCount;
//         updateRoomStats();
//     }

//     if (window.settings.showLikes === "0") return;

//     if (typeof msg.likeCount === 'number') {
//         addChatItem('#447dd4', msg, msg.label.replace('{0:user}', '').replace('likes',
//             `${msg.likeCount} likes`))
//     }
// })

// Member join
let joinMsgDelay = 0;
connection.on('member', (msg) => {
    if (window.settings.showJoins === "0") return;

    let addDelay = 250;
    if (joinMsgDelay > 500) addDelay = 100;
    if (joinMsgDelay > 1000) addDelay = 0;

    joinMsgDelay += addDelay;

    setTimeout(() => {
        joinMsgDelay -= addDelay;
        addChatItem('#21b2c2', msg, 'joined', true);
    }, joinMsgDelay);
})

// New chat comment received
connection.on('chat', (msg) => {
    if (window.settings.showChats === "0") return;

    addChatItem('', msg, 'chat');
})


// New gift received
connection.on('gift', (data) => {
    // console.log(data);
    // if (!isPendingStreak(data) && data.diamondCount > 0) {
    //     diamondsCount += (data.diamondCount * data.repeatCount);
    //     updateRoomStats();
    // }

    // if (window.settings.showGifts === "0") return;

    // addGiftItem(data);
})

// share, follow
// connection.on('social', (data) => {
//     if (window.settings.showFollows === "0") return;

//     let color = data.displayType.includes('follow') ? '#ff005e' : '#2fb816';
//     addChatItem(color, data, data.label.replace('{0:user}', ''));
// })

connection.on('streamEnd', () => {
    $('#stateText').text('Stream ended.');

    // schedule next try if obs username set
    if (window.settings.username) {
        setTimeout(() => {
            connect(window.settings.username);
        }, 30000);
    }
})