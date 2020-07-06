# The Done List Block

Instead of making a list of things to do, this block allows you to document what has already been done. It's a way to remind ourselves that even when it feels like we aren't productive, there are small wins we can recognize throughout the day.

When a done list item is added via the block a message congratulating you on your acheivement is sent by SMS using a Twilio function.


# Instructions to send text messages
Create a Twilio function and update your phone number settings to use the function path as a webhook when a message is received.

This is the code to paste in the configuration of your Function.
```
exports.handler = function(context, event, callback) {
  context.getTwilioClient().messages.create({
    to: '+15555555555', //Enter your phone to receive a text
    from: '+15555555555', //Enter your Twilio phone number
    body: `"${event.msg}" - That's a win, good job! `
  }).then(msg => {
    callback(null, msg.sid);
  }).catch(err => callback(err));
}
```

Rename sample.config.js, uncomment the code and update it with your own path from the Twilio function.