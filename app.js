'use strict';
require('dotenv').config();

process.env.DEBUG = 'actions-on-google:*';
require('isomorphic-fetch');
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let ActionsSdkApp = require('actions-on-google').ActionsSdkApp; //biju added to test rich response


let app = express();
app.use(bodyParser.json());

const getCompanyIntent = 'getCompany';

const huyyaActionIntent = 'huyya_Action';

const readTweetActionIntent = 'readTweet_Action';

const reminderActionIntent = 'reminder_Action';

const getRichActionIntent = 'getRich_Action';

const cardsActionIntent = 'cards_Action';

const listActionIntent = 'list_Action';

const welcomeActionIntent = 'welcome_Action';

const companyArgument = 'company';
const marketsDataKey = process.env.markets;
const sessionIds = {};


app.get('/webhook', function (req, res) {
  res.send('Use the /webhook endpoint.')
})

/*
app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  // the payload is stored on req.body
  console.log(req.body)
  // the value of Action from api.ai is stored in req.body.result.action
  console.log('* Received action -- %s', req.body.result.action)
  // parameters are stored in req.body.result.parameters
  var webhookReply = 'Hello from the webhook.'
  // the most basic response
  res.status(200).json({
    source: 'webhook',
    speech: webhookReply,
    displayText: webhookReply
  })
});
*/


app.post('/webhook', function (req, res) {
  /*const thisSessionID = req.body.sessionId;
  if (sessionIds[thisSessionID] === undefined ){
      sessionIds[thisSessionID] = [thisSessionID];
  } else {
    sessionIds[thisSessionID].push(thisSessionID);
  }
  console.log (sessionIds[thisSessionID], 'Number of calls:', sessionIds[thisSessionID].length);
*/
  console.log('>>>> BODY >>>> \n\n', JSON.stringify(req.body), '\n\n');
  console.log ('req.body=', JSON.stringify(req.body));
 // console.log ('EXTRACTED_SessionId=' , req.body.sessionId);
 // console.log ('EXTRACTED_conversation_id=' , req.body.originalRequest.data.conversation.conversation_id);
  const assistant = new Assistant({request: req, response: res});

  const sdk = new ActionsSdkApp({request: req, response: res}); //biju added for rich response
  
  
 function welcomeAction (sdk) {
  

sdk.ask(sdk.buildRichResponse()
    .addSimpleResponse({speech: '<speak> <audio src="https://bablashee.000webhostapp.com/blasheep.mp3"></audio>' + 
      'I am bijus digital assistant. I can set reminders for him on your behalf or answer your basic quesstions about him.'+
      'What would you like to do?</speak>',
      displayText: 'I am biju\'s digital assistant. What would you like to do?'})
    .addSuggestions(['Remind Biju', 'Know more', 'Send a message', 'Never mind'])
    .addSuggestionLink('Suggestion Link', 'https://www.bijuneyyan.info')
  );

}


  function getCompany (assistant) {
  
    
  //let company = assistant.getArgument(companyArgument);

  /* fetch(`http://markets.ft.com/research/webservices/securities/v1/search?query=${company}&source=${marketsDataKey}`).then((data) => {
    if (data.ok) {
        return data.json();
      }
    }).then((json) => {
    fetch(`http://markets.ft.com/research/webservices/companies/v1/profile?symbols=${json.data.searchResults[0].symbol}&source=${marketsDataKey}`).then((data) => {
      if (data.ok) {
          return data.json();
        }
      }).then((json) => {
      assistant.ask(json.data.items[0].profile.description);
    });
    }).catch((error) => {
    console.log(error)
  }); */ //commented by biju

assistant.tell('hiyya');
    
/*  
 var webhookReply = 'Hello asdf.'
   res.status(200).json({
    source: 'webhook',
    speech: webhookReply,
    displayText: 'webhookReply'
}) //added by biju
*/

  }


  function huyyaAction (assistant) {
  

assistant.tell('huyya');
    


  }


  function readTweetAction (assistant) {
  

//assistant.tell('I read tweets');


var Twit = require('twit');

var T = new Twit({
    consumer_key:         '9xGcRhGwuJ0Tj2WNpcx2z6T54'
  , consumer_secret:      'iiklmzCiankgZrei5JwLQwFOYpnAMqD9Li2VTNS1EyRlifXOTG'
  , access_token:         '19954424-j8LKSDipZv4lqv8VbwnZztzAhVoV8ftfN0SI2UGMK'
  , access_token_secret:  'VBmEwptCNUo2GQ6LdNgh172pd2wdW1L6pCVxt8Dmj1MsD'
})

var options = { screen_name: 'bijuneyyan',
                count: 1 };

T.get('statuses/user_timeline', options , function(err, data) {
  for (var i = 0; i < data.length ; i++) {
    assistant.tell(data[i].text);
  }
})
    


  }


    function reminderAction (assistant) {
  

var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."



var http = require("http");
var options = {
  hostname: 'maker.ifttt.com',
  port: 80,
  path: '/trigger/dothis/with/key/bX4ry_sAipRiF3FanH3K0Z',
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  }
};
var post_req = http.request(options, function(post_res) {
  console.log('Status: ' + post_res.statusCode);
  console.log('Headers: ' + JSON.stringify(post_res.headers));
  post_res.setEncoding('utf8');
  post_res.on('data', function (post_body) {
    console.log('Body: ' + post_body );
  });
});
post_req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
post_req.write('{"value1":"');
post_req.write(speech);
post_req.write('"}');
post_req.end();



return res.json({
        speech: "Okay, I will try and remind biju to " + speech + ". Anything else?",
        displayText: "Okay, I will remind biju to " + speech + ". Anything else?", //Biju added +speech part
        contextOut: [{"name":"cBye", "lifespan":"1"}], //Biju added
        source: 'webhook-echo-sample'
}); 
    


  }


 function getRichAction (sdk) {
  

//const sdk = new ActionsSdkApp({request, response}); // not needed since already declared above

// block below actually works but commented since it's only convDrivers
/*  sdk.ask(sdk.buildRichResponse()
    .addSimpleResponse({speech: 'Howdy! I can tell you fun facts about ' +
        'almost any number like 0, 42, or 100. What number do you have ' +
        'in mind?',
      displayText: 'Howdy! I can tell you fun facts about almost any ' +
        'number. What number do you have in mind?'})
    .addSuggestions(['0', '42', '100', 'Never mind'])
    .addSuggestionLink('Suggestion Link', 'https://assistant.google.com/')
  );*/


sdk.ask(sdk.buildRichResponse()
    // Create a basic card and add it to the rich response
    .addSimpleResponse({speech: 'Howdy! I can tell you',
      displayText: 'Howdy!'})
    .addBasicCard(sdk.buildBasicCard('42 is an even composite number. It' +
      'is composed of three distinct prime numbers multiplied together. It' +
      'has a total of eight divisors. 42 is an abundant number, because the' +
      'sum of its proper divisors 54 is greater than itself. To count from' +
      '1 to 42 would take you about twenty-one…')
      .setTitle('Math & prime numbers')
      .addButton('Read more', 'https://example.google.com/mathandprimes')
      .setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/PM5544_with_non-PAL_signals.png/384px-PM5544_with_non-PAL_signals.png', 'Image alternate text')
      .setImageDisplay('CROPPED')
    )
  );

    


  }


  function cardsAction (sdk) {

sdk.askWithCarousel('Alright! Here are a few things you can learn. Which sounds interesting?',
    // Build a carousel
    sdk.buildCarousel()
    // Add the first item to the carousel
    .addItems(sdk.buildOptionItem('MATH_AND_PRIME',
      ['math', 'math and prime', 'prime numbers', 'prime'])
      .setTitle('Math & prime numbers')
      .setDescription('42 is an abundant number because the sum of its ' +
        'proper divisors 54 is greater…')
      .setImage('http://example.com/math_and_prime.jpg', 'Math & prime numbers'))
    // Add the second item to the carousel
    .addItems(sdk.buildOptionItem('EGYPT',
      ['religion', 'egpyt', 'ancient egyptian'])
      .setTitle('Ancient Egyptian religion')
      .setDescription('42 gods who ruled on the fate of the dead in the ' +
        'afterworld. Throughout the under…')
      .setImage('http://example.com/egypt', 'Egypt')
    )
    // Add third item to the carousel
    .addItems(sdk.buildOptionItem('RECIPES',
      ['recipes', 'recipe', '42 recipes'])
      .setTitle('42 recipes with 42 ingredients')
      .setDescription('Here\'s a beautifully simple recipe that\'s full ' +
        'of flavor! All you need is some ginger and…')
      .setImage('http://example.com/recipe', 'Recipe')
    )
  );


  }


    function listAction (sdk) {

sdk.askWithList('Alright! Here are a few things you can learn. Which sounds interesting?',
    // Build a list
    sdk.buildList('Things to learn about')
      // Add the first item to the list
      .addItems(sdk.buildOptionItem('MATH_AND_PRIME',
        ['math', 'math and prime', 'prime numbers', 'prime'])
        .setTitle('Math & prime numbers')
        .setDescription('42 is an abundant number because the sum of its ' +
        'proper divisors 54 is greater…')
        .setImage('http://example.com/math_and_prime.jpg', 'Math & prime numbers'))
      // Add the second item to the list
      .addItems(sdk.buildOptionItem('EGYPT',
        ['religion', 'egpyt', 'ancient egyptian'])
        .setTitle('Ancient Egyptian religion')
        .setDescription('42 gods who ruled on the fate of the dead in the ' +
        'afterworld. Throughout the under…')
        .setImage('http://example.com/egypt', 'Egypt')
      )
      // Add third item to the list
      .addItems(sdk.buildOptionItem('RECIPES',
        ['recipes', 'recipe', '42 recipes'])
        .setTitle('42 recipes with 42 ingredients')
        .setDescription('Here\'s a beautifully simple recipe that\'s full ' +
        'of flavor! All you need is some ginger and…')
        .setImage('http://example.com/recipe', 'Recipe')
      )
  );



  }


//action map begins below



  let actionMap = new Map();
  actionMap.set(welcomeActionIntent, welcomeAction);
  actionMap.set(getCompanyIntent, getCompany);
  actionMap.set(huyyaActionIntent, huyyaAction);
  actionMap.set(readTweetActionIntent, readTweetAction);
  actionMap.set(reminderActionIntent, reminderAction);
  actionMap.set(getRichActionIntent, getRichAction);
  actionMap.set(cardsActionIntent, cardsAction);
  actionMap.set(listActionIntent, listAction);


  assistant.handleRequest(actionMap);
});


if (module === require.main) {
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

module.exports = app;
