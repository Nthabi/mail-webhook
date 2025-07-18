const cron = require('node-cron');
const axios = require('axios');
const postmark = require('postmark');
const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);
require('dotenv').config();

function scheduleReminder({ email, task, time, frequency }) {
    if (!time) return;

    const [hour, minute] = time.split(':').map(Number);
    const cronTime = `${minute} ${hour} * * *`; // daily

    if (frequency === 'daily') {
        cron.schedule(cronTime, () => {
            sendReminderEmail(email, `Reminder: ${task}`, `Don't forget to: ${task}`);
        });
    }
}

async function sendReminderEmail(to, task, time) {
  const subject = 'Medication Reminder';
  const body = `This is your reminder to: ${task} at ${time}.`;

  return await client.sendEmail({
    From: process.env.SENDER_EMAIL,
    To: to,
    Subject: subject,
    TextBody: body,
  });
}

module.exports = { scheduleReminder, sendReminderEmail };
