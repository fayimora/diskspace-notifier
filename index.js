var diskspace = require('diskspace');
var twilio = require('twilio');
var client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var recepients = process.env.TWILIO_RECEPIENTS.split(",");

console.log(recepients);
setInterval(main, 1000 * 60 * 60);

function main() {
  diskspace.check('/', function (err, total, free, status) {
    var GB = 1000000000.0;
    var total = total/GB;
    var free = free/GB;
    var used =  (total - free);

    console.log("Total Space: " + total);
    console.log("Free Space: " + free);
    console.log("Used Space: " + used);

    if(free < 5.0) {
      recepients.forEach(function(recepient){
        sendText(recepient);
      });
    }
  });
}


function sendText(recepient) {
  client.sms.messages.create({
    to: recepient,
    from: process.env.TWILIO_NUMBER,
    body: "Ahoy hoy! We have < 5GB on the server. Time to delete your shit!"
  }, function(error, message) {
    if (!error) {
      console.log('Success! The SID for this SMS message is:');
      console.log(message.sid);

      console.log('Message sent on:');
      console.log(message.dateCreated);
    } else {
      console.log('Oops! There was an error.');
      console.log(error);
    }
  });
}
