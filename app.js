'use strict';
require('dotenv').config();

process.env.DEBUG = 'actions-on-google:*';
require('isomorphic-fetch');
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());

const getCompanyIntent = 'getCompany';

const huyyaActionIntent = 'huyya_Action';

const reminderActionIntent = 'reminder_Action';

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

    function reminderAction (assistant) {
  

assistant.tell('reminder set');
    


  }


  let actionMap = new Map();
  actionMap.set(getCompanyIntent, getCompany);
  actionMap.set(huyyaActionIntent, huyyaAction);
  actionMap.set(reminderActionIntent, reminderAction);

  assistant.handleRequest(actionMap);
});


if (module === require.main) {
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

module.exports = app;
