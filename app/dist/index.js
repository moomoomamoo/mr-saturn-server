"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Running Mr Saturn server");
const tmi = require("tmi.js");
const secrets_1 = require("./secrets/secrets");
const firebase_1 = require("./firebase/firebase");
const configs_1 = require("./configs/configs");
const moment = require("moment");
const app_1 = require("firebase/app");
const helpers_1 = require("./helpers/helpers");
let _channel_names = configs_1.CHANNEL_NAMES || process.env.CHANNEL_NAMES;
if (typeof _channel_names === 'string') {
    _channel_names = _channel_names.split(',');
}
// Create a client with using the twitchCerts from secrets and CHANNEL_NAMES from configs
const tmiClient = tmi.client({
    identity: {
        username: (secrets_1.twitchCerts === null || secrets_1.twitchCerts === void 0 ? void 0 : secrets_1.twitchCerts.BOT_USERNAME) || process.env.BOT_USERNAME,
        password: (secrets_1.twitchCerts === null || secrets_1.twitchCerts === void 0 ? void 0 : secrets_1.twitchCerts.OAUTH_TOKEN) || process.env.OAUTH_TOKEN,
    },
    channels: _channel_names,
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Inintalize Firebase and import any services we want (firestore, auth)
    yield firebase_1.firebaseInit();
    // Display when connected
    tmiClient.on('connected', (addr, port) => {
        console.log(`* Connected to ${addr}:${port}`, moment().format('LL LTS'));
    });
    // Register our on message event handler
    tmiClient.on('message', onMessageHandler);
    setTimeout(() => {
        periodicPrompt();
    }, 30 * 1000 * 60);
    // Connect to Twitch
    tmiClient.connect();
});
const milkManCommand = (command, channel, context) => __awaiter(void 0, void 0, void 0, function* () {
    if (context && (context['display-name'] || context.username)) {
        const seed = Math.floor(Math.random());
        if (command[command.length - 1] === '?' || seed) {
            yield tmiClient.say(channel, `@${context['display-name'] || context.username}, I am the milk man. My milk is delicious`);
        }
        else {
            yield tmiClient.say(channel, `@${context['display-name'] || context.username}, who is the milkman?`);
        }
    }
    else {
        yield tmiClient.say(channel, `Who is the milkman?`);
    }
    console.log(`* Executed ${command} command (milkman)`, moment().format('LL LTS'));
});
const sandwichCommand = (command, channel, context) => __awaiter(void 0, void 0, void 0, function* () {
    if (context && (context['display-name'] || context.username)) {
        yield tmiClient.say(channel, `Hi @${context['display-name'] || context.username}. You get a sammich! 🥪`);
    }
    else {
        yield tmiClient.say(channel, `Someone want a sammich? 🥪`);
    }
    console.log(`* Executed ${command} command (sandwich)`, moment().format('LL LTS'));
});
const diceCommand = (command, channel) => __awaiter(void 0, void 0, void 0, function* () {
    const seed = +(command.substring(2));
    if (seed > 0) {
        tmiClient.say(channel, "" + (Math.floor(Math.random() * seed) + 1));
        console.log(`* Executed ${command} command (dice)`, moment().format('LL LTS'));
    }
});
const botGreetingCommand = (command, channel, context) => __awaiter(void 0, void 0, void 0, function* () {
    if (context && (context['display-name'] || context.username)) {
        tmiClient.say(channel, `Hi @${context['display-name'] || context.username}. I am a good bot.`);
    }
    else {
        tmiClient.say(channel, `I am a good bot yes.`);
    }
    console.log(`* Executed ${command} command (bot greetings)`, moment().format('LL LTS'));
});
const juggalosCommand = (command, channel, context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`* Executed ${command} command (juggalos)`, moment().format('LL LTS'));
    const person = context && (context['display-name'] || context.username) || "Someone";
    tmiClient.say(channel, `@${person} JUGALLOS!!!!`);
});
const botRPSCommand = (command, channel, context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`* Executed ${command} command (rps)`, moment().format('LL LTS'));
    const msg = command.trim().toLowerCase();
    let request = 'paper';
    if (msg.includes('rock')) {
        request = 'rock';
    }
    else if (msg.includes('sizzor')) {
        request = 'sizzors';
    }
    const person = context && (context['display-name'] || context.username) || "Someone";
    const _seed = Math.floor(Math.random() * 15);
    if (_seed === 0) {
        tmiClient.say(channel, `@${person} choose ${request}. I chose rocket launcher. Looks like I win! Haha`);
        return;
    }
    else if (_seed === 1) {
        tmiClient.say(channel, `@${person} choose ${request}. I tried to use the 3rd option but got undefined instead. You win!`);
        return;
    }
    else if (_seed === 2) {
        tmiClient.say(channel, `@${person} choose ${request}. Why not choose love? What's love to you?`);
        return;
    }
    const seed = Math.floor(Math.random() * 3);
    const options = ['paper', 'sizzors', 'rock'];
    const response = options[seed];
    if (request === response) {
        tmiClient.say(channel, `@${person} choose ${request}. I chose ${response}. Looks like a draw.`);
    }
    else if (request === 'paper' && response === 'rock') {
        tmiClient.say(channel, `@${person} choose ${request}. I chose ${response}. Looks like you win...`);
    }
    else if (request === 'rock' && response === 'sizzors') {
        tmiClient.say(channel, `@${person} choose ${request}. I chose ${response}. Looks like you win...`);
    }
    else if (request === 'sizzors' && response === 'paper') {
        tmiClient.say(channel, `@${person} choose ${request}. I chose ${response}. Looks like you win...`);
    }
    else {
        tmiClient.say(channel, `@${person} choose ${request}. I chose ${response}. Looks like I win!`);
    }
});
const timeCommand = (command, channel, context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`* Executed ${command} command (time)`, moment().format('LL LTS'));
    const timestampStr = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    const person = context && (context['display-name'] || context.username) || "Someone";
    tmiClient.say(channel, `@${person} ${timestampStr}`);
});
const storeLoveQuote = (context, msg) => __awaiter(void 0, void 0, void 0, function* () {
    const rand = helpers_1.getRand();
    const id = yield app_1.firestore().collection("love").add({
        context: context,
        rand: rand,
        msg: msg
    }).then(docRef => {
        console.log(" * Stored love quote in firebase", rand, docRef.id);
        return rand;
    });
    return id;
});
const getRandomLoveQuote = (rand) => __awaiter(void 0, void 0, void 0, function* () {
    const _rand = rand || helpers_1.getRand();
    if (rand) {
        console.log(' ~ love seed', rand, '->', _rand);
    }
    const _querySnapshot_1 = yield app_1.firestore().collection("love").where("rand", ">=", _rand).get();
    if (_querySnapshot_1 && _querySnapshot_1.size) {
        const data = _querySnapshot_1.docs[0].data();
        return {
            id: data.rand,
            quote: `${data.msg} - ${data.context && data.context['display-name'] || 'unknown display-name'}`,
        };
    }
    else {
        const _querySnapshot_2 = yield app_1.firestore().collection("love").where("rand", "<=", _rand).get();
        if (_querySnapshot_2 && _querySnapshot_2.size) {
            const data = _querySnapshot_2.docs[0].data();
            return {
                id: data.rand,
                quote: `${data.msg} - ${data.context && data.context['display-name'] || 'unknown display-name'}`,
            };
        }
    }
    return undefined;
});
const getLoveQuoteByID = (loveID) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(' ~ getLoveQuoteByID', loveID);
    const _querySnapshot = yield app_1.firestore().collection("love").where("rand", "==", loveID).get();
    if (_querySnapshot && _querySnapshot.size) {
        const data = _querySnapshot.docs[0].data();
        return {
            id: data.rand,
            quote: `${data.msg} - ${data.context && data.context['display-name'] || 'unknown display-name'}`,
        };
    }
    return undefined;
});
const deleteLoveQuoteByID = (loveID) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(' ~ deleteLoveQuoteByID', loveID);
    const _querySnapshot = yield app_1.firestore().collection("love").where("rand", "==", loveID).get();
    let deleted = false;
    _querySnapshot.forEach((doc) => {
        doc.ref.delete();
        deleted = true;
    });
    return deleted;
});
const periodicPrompt = () => {
    for (let CHANNEL_NAME of configs_1.CHANNEL_NAMES) {
        const split = CHANNEL_NAME.split('#');
        const channel = split[split.length - 1];
        tmiClient.say(channel, `Hey chat! Teach me what love is by typing "Love is <insert the rest of the quote>". What is love?`);
        console.log(`* Executed periodicPrompt ~`, moment().format('LL LTS'));
    }
    setTimeout(() => {
        periodicPrompt();
    }, 30 * 1000 * 60 + Math.random() * 30 * 1000 * 60);
};
let lastLoveID = null;
const updateJumpScareTimestamp = () => {
    console.log(" ~ updateJumpScareTimestamp called");
    return app_1.firestore().collection("saturns").doc('settings').update({
        jumpScareTimestamp: Date.now() + 1000 * 60 * 60 * 1,
    });
};
// Called every time a message comes in
const onMessageHandler = (channel, context, rawMsg, self) => __awaiter(void 0, void 0, void 0, function* () {
    // Ignore messages from the bot 
    if (self) {
        return;
    }
    // Remove whitespace from chat message
    const msg = (rawMsg || "").trim();
    const command = msg.toLowerCase();
    const parts = command.split(' ');
    console.log(" * Message: ", context && context['display-name'] || 'unknown display-name', `(${context && context.username || 'unknown username'})`, rawMsg);
    for (const part of parts) {
        if (part === 'hate' || part === 'help' || part === 'dislike' || part === "don't" || part === "never" || part === "heart") {
            setTimeout(() => {
                updateJumpScareTimestamp();
            }, 15 * 1000);
        }
    }
    if (command.includes('moo command')) {
        for (let CHANNEL_NAME of configs_1.CHANNEL_NAMES) {
            const split = CHANNEL_NAME.split('#');
            const channel = split[split.length - 1];
            tmiClient.say(channel, `olive x<#> | clear olives | milkman | sandwich | mona lisa | !d<#> | love is <rest of the quote> | what is love? | memory id | memory quote <memory id> | forget memory <memory id>`);
            console.log(`* Executed ${command} command (moo commands) ~`, moment().format('LL LTS'));
        }
        return Promise.resolve();
    }
    if (command.includes('memory quote') || command.includes('love quote')) {
        const parts = command.split(' ');
        const loveID = parts[parts.length - 1];
        const _q = yield getLoveQuoteByID(loveID);
        if (_q && _q.quote) {
            for (let CHANNEL_NAME of configs_1.CHANNEL_NAMES) {
                const split = CHANNEL_NAME.split('#');
                const channel = split[split.length - 1];
                tmiClient.say(channel, `${_q.quote}`);
                lastLoveID = _q.id;
                console.log(`* Executed ${command} command (memory quote) ~#${loveID}~ 200`, moment().format('LL LTS'));
            }
        }
        else {
            console.log(`* Executed ${command} command (memory quote) ~#${loveID}~ 404`, moment().format('LL LTS'));
        }
        return Promise.resolve();
    }
    if (command.startsWith('forget memory') || command.startsWith('forget love')) {
        // moomoomamoo - '36547695'
        if (!context || (!context.mod && context['user-id'] !== '36547695')) {
            console.warn(" ~ forgot memory canceled since not mod context");
            return Promise.resolve();
        }
        const parts = command.split(' ');
        const loveID = parts[parts.length - 1];
        yield deleteLoveQuoteByID(loveID);
        if (loveID) {
            for (let CHANNEL_NAME of configs_1.CHANNEL_NAMES) {
                const split = CHANNEL_NAME.split('#');
                const channel = split[split.length - 1];
                tmiClient.say(channel, `forgot love quote id ${loveID}`);
                console.log(`* Executed ${command} command (forgot love id) ~#${loveID}~`, moment().format('LL LTS'));
            }
        }
        return Promise.resolve();
    }
    if (command.includes('memory id') || command.includes('love id') || command.includes('quote id')) {
        // if (lastLoveID) {
        for (let CHANNEL_NAME of configs_1.CHANNEL_NAMES) {
            const split = CHANNEL_NAME.split('#');
            const channel = split[split.length - 1];
            tmiClient.say(channel, `last memory quote id ${lastLoveID || '<none>'}`);
            console.log(`* Executed ${command} command (love id) ~#${lastLoveID}~`, moment().format('LL LTS'));
        }
        // }
        return Promise.resolve();
    }
    // If the command is known, let's execute it
    if (command.includes('woop woop') || command.includes('whoop whoop')) {
        yield juggalosCommand(command, channel, context);
    }
    else if (parts.includes('paper') || parts.includes('rock') || parts.includes('sizzor')) {
        yield botRPSCommand(command, channel, context);
    }
    else if (parts.includes('time')) {
        yield timeCommand(command, channel, context);
    }
    else if (command.includes('milk')) {
        yield milkManCommand(command, channel, context);
    }
    else if (command.includes('sandwich') || command.includes('sammich')) {
        yield sandwichCommand(command, channel, context);
    }
    else if (/\!(d|D)([1-9]|0)+/.test(command)) {
        yield diceCommand(command, channel);
    }
    else if (command.includes('bot') && (command.includes('moo') || command.includes('cow')) && helpers_1.commandHasGreeting(command)) {
        yield botGreetingCommand(command, channel, context);
    }
    // Store the latest message of the channel
    // This will trigger the Mr. Saturn client app
    if (context) {
        yield app_1.firestore().collection("saturns").doc(channel || "unknown_channel").collection('contexts').doc("" + (context.username || context['display-name'] || Date.now())).set(context);
        yield app_1.firestore().collection("saturns").doc('chat').set({
            timestamp: Date.now(),
            msg: msg || "",
            'display-name': context && context['display-name'] || 'unknown display-name',
            username: context && context.username || 'unknown username',
            context: context || null,
        });
    }
    // Check if command starts with 'love is'
    if (command.indexOf('love is') === 0) {
        // Store the message if it does
        const id = yield storeLoveQuote(context, msg);
        console.log(" * Stored love quote", context && context["display-name"] || 'unknown display-name', id, msg);
        tmiClient.say(channel, ` * Stored love quote ~love #${id}~`);
        return;
    }
    const id = command.split('love #')[1];
    const loveQuote = yield getRandomLoveQuote(id);
    // Only 1 in 3 chance to spawn "relatable" love quote
    const _otherSeed = Math.floor(Math.random() * 3);
    if (loveQuote) {
        // If command includes love or command is a subset of loveQuote (or vice versa)
        // Say love quote
        if (command.indexOf('love') !== -1) {
            for (let CHANNEL_NAME of configs_1.CHANNEL_NAMES) {
                const split = CHANNEL_NAME.split('#');
                const channel = split[split.length - 1];
                tmiClient.say(channel, `${loveQuote.quote}`);
                lastLoveID = loveQuote.id;
                console.log(`* Executed ${command} command (get love quote 1) ~#${loveQuote.id}~`, moment().format('LL LTS'));
            }
        }
        else if (_otherSeed === 0 && helpers_1.substringsMatch(loveQuote.quote, command)) {
            for (let CHANNEL_NAME of configs_1.CHANNEL_NAMES) {
                const split = CHANNEL_NAME.split('#');
                const channel = split[split.length - 1];
                tmiClient.say(channel, `${loveQuote.quote}`);
                lastLoveID = loveQuote.id;
                console.log(`* Executed ${command} command (get love quote 2) ~#${loveQuote.id}~`, moment().format('LL LTS'));
            }
        }
        else if (command.includes(loveQuote.id)) {
            for (let CHANNEL_NAME of configs_1.CHANNEL_NAMES) {
                const split = CHANNEL_NAME.split('#');
                const channel = split[split.length - 1];
                tmiClient.say(channel, `${loveQuote.quote}`);
                lastLoveID = loveQuote.id;
                console.log(`* Executed ${command} command (get love quote 3) ~#${loveQuote.id}~`, moment().format('LL LTS'));
            }
        }
    }
});
main();
//# sourceMappingURL=index.js.map