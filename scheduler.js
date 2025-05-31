const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

function scheduleReminder({ email, task, time, frequency }) {
    if (!time) return;

    const [hour, minute] = time.split(':').map(Number);
    const cronTime = `${minute} ${hour} * * *`; // daily

    if (frequency === 'daily') {
        cron.schedule(cronTime, () => {
            sendEmail(email, `Reminder: ${task}`, `Don't forget to: ${task}`);
        });
    }
}

function sendEmail(to, subject, body) {
    return axios.post('https://api.postmarkapp.com/email', {
        From: process.env.SENDER_EMAIL,
        To: to,
        Subject: subject,
        TextBody: body
    }, {
        headers: {
            'X-Postmark-Server-Token': process.env.POSTMARK_API_TOKEN
        }
    });
}

module.exports = { scheduleReminder, sendEmail };
