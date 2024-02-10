const cron = require(`node-cron`);

cron.schedule('*/30 * * * * * *', (x) => {
    console.log(`\n\n>>>>>------${new Date().toLocaleTimeString('en-us',{ timeZone: 'Asia/Calcutta', hour: '2-digit', minute: '2-digit', second: '2-digit',  fractionalSecondDigits: 3 })}------->>\n | file: cron-jobs.js:5 | cron.schedule | x::`, x);
    console.log(`Hey there! Cron job did this.`)
})