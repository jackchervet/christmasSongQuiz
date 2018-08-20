/**
 * ************* COPYRIGHT DISCLAIMER *****************
 * 
 * A majority of this code was originally written by Amazon and made available for public use under the terms of the Alexa Skills tutorials. 
 * I have modified portions of this code, and this among other work was published in December 2017 to the Alexa Skill store as the skill titled "Christmas Song Quiz".
 */


'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = undefined;

function getSpeechDescription(item)
{
    let sentence = "The song, " + item.SongName + ", has a line that goes: " + item.SongLine + " " + item.Word + ".  Which other song would you like to know about?";
    return sentence;
}

function getQuestion(counter, property, item)
{
    //return "Here is your " + counter + "th question.  What is the " + formatCasing(property) + " of "  + item.StateName + "?";
    switch(property)
    {
        case "SongName":
            return "Here is your " + counter + "th question.  What song is this line from? " + item.SongLine + " " + item.Word + ".";
        break;
        case "Word":
            return "Here is your " + counter + "th question.  Finish this line from the song " + item.SongName + ". " + item.SongLine + " ";
        break;
    }
}

function getAnswer(property, item)
{
    switch(property)
    {
        case "SongName":
            return "The name of the song that goes: " + item.SongLine + " " + item.Word + ", is: " + item.SongName + ". ";
        break;
        case "Word":
            return "The ending of the line from " + item.SongName + " is: " + item.Word + ". The whole line goes: " + item.SongLine + " " + item.Word + ". ";
        break;
    }
}

const speechConsCorrect = ["Booya", "All righty", "Bam", "Bazinga", "Bingo", "Boom", "Bravo", "Cha Ching", "Cheers", "Dynomite",
"Hip hip hooray", "Hurrah", "Hurray", "Huzzah", "Oh dear.  Just kidding.  Hurray", "Kaboom", "Kaching", "Oh snap", "Phew",
"Righto", "Way to go", "Well done", "Whee", "Woo hoo", "Yay", "Wowza", "Yowsa"];

const speechConsWrong = ["Argh", "Aw man", "Blarg", "Blast", "Boo", "Bummer", "Darn", "D'oh", "Dun dun dun", "Eek", "Honk", "Le sigh",
"Mamma mia", "Oh boy", "Oh dear", "Oof", "Ouch", "Ruh roh", "Shucks", "Uh oh", "Wah wah", "Whoops a daisy", "Yikes"];

const WELCOME_MESSAGE = "Welcome to the Christmas Song Quiz Game!  You can ask me about a Christmas song, or you can ask me to start a quiz.  What would you like to do?";

const START_QUIZ_MESSAGE = "OK. I will ask you 10 questions about Christmas Songs.";

const EXIT_SKILL_MESSAGE = "Thank you for playing the Christmas Song Quiz Game!  Let's play again soon!";

const REPROMPT_SPEECH = "Which other song would you like to know about?";

const HELP_MESSAGE = "I know lines from Christmas songs.  You can ask me about a song, and I'll tell you what I know.  You can also test your knowledge by asking me to start a quiz.  What would you like to do?";


function getBadAnswer(item) { return "I'm sorry. " + item + " is not something I know very much about in this skill. " + HELP_MESSAGE; }

function getCurrentScore(score, counter) { return "Your current score is " + score + " out of " + counter + ". "; }

function getFinalScore(score, counter) { return "Your final score is " + score + " out of " + counter + ". "; }

const USE_CARDS_FLAG = false;

const data = [
                {Word: "spirits bright", SongName: "Jingle Bells", SongLine: "Bells on bobtail ring, making"},
                {Word: "mistletoe", SongName: "The Christmas Song", SongLine: "Everybody knows, a turkey and some"},
                {Word: "ninety two", SongName: "The Christmas Song", SongLine: "And so I'm offering this simple phrase to kids from one to"},
                {Word: "bough", SongName: "Have Yourself a Merry Little Christmas", SongLine: "Through the years we all will be together, if the fates allow. Hang a shining star upon the highest"},
                {Word: "calm", SongName: "Silent Night", SongLine: "Silent Night, Holy Night, all is"},
                {Word: "goodness sake", SongName: "Santa Claus is Coming to Town", SongLine: "He knows if you've been bad or good so be good for"},
                {Word: "Christmas tree", SongName: "All I Want for Christmas is You", SongLine: "I don't want a lot for Christmas, there is just one thing I need. I don't care about the presents underneath the"},
                {Word: "popping", SongName: "Let it Snow", SongLine: "It doesn't show signs of stopping, and I brought some corn for"},
                {Word: "party hop", SongName: "Rockin' Around the Christmas Tree", SongLine: "Rockin' around the Christmas tree at the Christmas"},
                {Word: "nose", SongName: "Frosty the Snowman", SongLine: "With a corncob pipe and a button"},
                {Word: "style", SongName: "Silver Bells", SongLine: "City sidewalks, busy sidewalks, dressed in holiday"},
                {Word: "silver lanes aglow", SongName: "It's Beginning to Look a lot Like Christmas", SongLine: "Take a look at the five and ten, glistening once again, with candy canes and"},
                {Word: "cheer", SongName: "It's the Most Wonderful Time of the Year", SongLine: "With the kids jingle belling and everyone telling you be of good"},
                {Word: "believe", SongName: "Grandma Got Run Over by a Reindeer", SongLine: "You can say there's no such thing as Santa, but as for me and Grandpa we"},
                {Word: "meet", SongName: "Holly Jolly Christmas", SongLine: "And when you walk down the street, say hello to friends you know and everyone you"},
                {Word: "say", SongName: "Rudolph the Red-Nosed Reindeer", SongLine: "Then one foggy Christmas Eve, Santa came to"},
                {Word: "kin", SongName: "We Wish You a Merry Christmas", SongLine: "Good tidings we bring, to you and your"},
                {Word: "haven't kissed", SongName: "Santa Baby", SongLine: "Think of all the fun I've missed; think of all the fellas that I"},
                {Word: "at all", SongName: "Christmas", SongLine: "They're singing Deck the Halls, but its not like Christmas"},
                {Word: "what I see", SongName: "Do You Hear What I Hear", SongLine: "Said the night wind to the little lamb: do you see"},
            ];

const counter = 0;

const states = {
    START: "_START",
    QUIZ: "_QUIZ"
};

const handlers = {
     "LaunchRequest": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
     },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AnswerIntent": function() {
        this.handler.state = states.START;
        this.emitWithState("AnswerIntent");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.handler.state = states.START;
        this.emitWithState("Start");
    }
};

const startHandlers = Alexa.CreateStateHandler(states.START,{
    "Start": function() {
        this.response.speak(WELCOME_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "AnswerIntent": function() {
        let item = getItem(this.event.request.intent.slots);

        if (item && item[Object.getOwnPropertyNames(data[0])[0]] != undefined)
        {
          console.log("\nMEMO's TEST\n");
            if (USE_CARDS_FLAG)
            {
                let imageObj = {smallImageUrl: getSmallImage(item), largeImageUrl: getLargeImage(item)};

                this.response.speak(getSpeechDescription(item)).listen(REPROMPT_SPEECH);
                this.response.cardRenderer(getCardTitle(item), getTextDescription(item), imageObj);            }
            else
            {
                this.response.speak(getSpeechDescription(item)).listen(REPROMPT_SPEECH);
            }
        }
        else
        {
            this.response.speak(getBadAnswer(item)).listen(getBadAnswer(item));

        }

        this.emit(":responseReady");
    },
    "QuizIntent": function() {
        this.handler.state = states.QUIZ;
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emitWithState("Start");
    }
});


const quizHandlers = Alexa.CreateStateHandler(states.QUIZ,{
    "Quiz": function() {
        this.attributes["response"] = "";
        this.attributes["counter"] = 0;
        this.attributes["quizscore"] = 0;
        this.emitWithState("AskQuestion");
    },
    "AskQuestion": function() {
        if (this.attributes["counter"] == 0)
        {
            this.attributes["response"] = START_QUIZ_MESSAGE + " ";
        }

        let random = getRandom(0, data.length-1);
        let item = data[random];

        let propertyArray = Object.getOwnPropertyNames(item);
        let property = propertyArray[getRandom(0, propertyArray.length-2)];

        this.attributes["quizitem"] = item;
        this.attributes["quizproperty"] = property;
        this.attributes["counter"]++;

        let question = getQuestion(this.attributes["counter"], property, item);
        let speech = this.attributes["response"] + question;

        this.emit(":ask", speech, question);
    },
    "AnswerIntent": function() {
        let response = "";
        let speechOutput = "";
        let item = this.attributes["quizitem"];
        let property = this.attributes["quizproperty"]

        let correct = compareSlots(this.event.request.intent.slots, item[property]);

        if (correct)
        {
            response = getSpeechCon(true);
            this.attributes["quizscore"]++;
        }
        else
        {
            response = getSpeechCon(false);
        }

        response += getAnswer(property, item);

        if (this.attributes["counter"] < 10)
        {
            response += getCurrentScore(this.attributes["quizscore"], this.attributes["counter"]);
            this.attributes["response"] = response;
            this.emitWithState("AskQuestion");
        }
        else
        {
            response += getFinalScore(this.attributes["quizscore"], this.attributes["counter"]);
            speechOutput = response + " " + EXIT_SKILL_MESSAGE;

            this.response.speak(speechOutput);
            this.emit(":responseReady");
        }
    },
    "AMAZON.RepeatIntent": function() {
        let question = getQuestion(this.attributes["counter"], this.attributes["quizproperty"], this.attributes["quizitem"]);
        this.response.speak(question).listen(question);
        this.emit(":responseReady");
    },
    "AMAZON.StartOverIntent": function() {
        this.emitWithState("Quiz");
    },
    "AMAZON.StopIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak(EXIT_SKILL_MESSAGE);
        this.emit(":responseReady");
    },
    "AMAZON.HelpIntent": function() {
        this.response.speak(HELP_MESSAGE).listen(HELP_MESSAGE);
        this.emit(":responseReady");
    },
    "Unhandled": function() {
        this.emitWithState("AnswerIntent");
    }
});

function compareSlots(slots, value)
{
    for (let slot in slots)
    {
        if (slots[slot].value != undefined)
        {
            if (slots[slot].value.toString().toLowerCase() == value.toString().toLowerCase())
            {
                return true;
            }
        }
    }
    return false;
}

function getRandom(min, max)
{
    return Math.floor(Math.random() * (max-min+1)+min);
}

function getRandomSymbolSpeech(symbol)
{
    return "<say-as interpret-as='spell-out'>" + symbol + "</say-as>";
}

function getItem(slots)
{
    let propertyArray = Object.getOwnPropertyNames(data[0]);
    let value;

    for (let slot in slots)
    {
        if (slots[slot].value !== undefined)
        {
            value = slots[slot].value;
            for (let property in propertyArray)
            {
                let item = data.filter(x => x[propertyArray[property]].toString().toLowerCase() === slots[slot].value.toString().toLowerCase());
                if (item.length > 0)
                {
                    return item[0];
                }
            }
        }
    }
    return value;
}

function getSpeechCon(type)
{
    let speechCon = "";
    if (type) return "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>";
    else return "<say-as interpret-as='interjection'>" + speechConsWrong[getRandom(0, speechConsWrong.length-1)] + " </say-as><break strength='strong'/>";
}

function formatCasing(key)
{
    key = key.split(/(?=[A-Z])/).join(" ");
    return key;
}

function getTextDescription(item)
{
    let text = "";

    for (let key in item)
    {
        text += formatCasing(key) + ": " + item[key] + "\n";
    }
    return text;
}

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers, startHandlers, quizHandlers);
    alexa.execute();
};
