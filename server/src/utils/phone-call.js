const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


async function initiateCall(phoneNumber) {
    let credentials = {
        url: process.env.TWILIO_URL,
        to: phoneNumber,
        from: process.env.TWILIO_FROM_NUMBER
    }

    console.log(`Calling`, phoneNumber);
    client.calls
        .create(credentials)
        .then(call => console.log(call));
}

module.exports = { initiateCall }

