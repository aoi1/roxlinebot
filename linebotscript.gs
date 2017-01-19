var CHANNEL_ACCESS_TOKEN = 'XXXX'; //linebotサービスのアクセストークン
var API_KEY = 'XXXXX'; // docomoAPIのアクセストークン
var chat_endpoint = 'https://api.apigw.smt.docomo.ne.jp/dialogue/v1/dialogue';
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';


function doPost(e) {
   
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;
  var reply_text;
  // PPAPに反応できるようにする
  if( user_message.match(/have a pen/) || user_message == 'アイハブアペン' ) {
  reply_text = 'I have an apple〜〜 https://youtu.be/0E00Zuayv9Q';
  } else {
  res = UrlFetchApp.fetch( chat_endpoint + '?APIKEY=' + API_KEY, {
    'headers': {
    'Content-Type': 'application/json'
    },
    'method': 'post',
    'payload': JSON.stringify({
    'utt' : user_message,
    'age' : 10
    }),
  });
  
  var data = JSON.parse(res);
  reply_text = data['utt']; 
}
  

  UrlFetchApp.fetch(line_endpoint, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': [
        {'type': 'text', 'text': reply_text},
      ],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
