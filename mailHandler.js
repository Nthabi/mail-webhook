const db = require('./db');
const { parseReminder } = require('./parseUtils');
const { scheduleReminder } = require('./scheduler');
const postmark = require('postmark');
const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

async function handleIncomingEmail(emailData) {
    const sender = emailData.FromFull.Email;
    const body = emailData.TextBody || emailData.HtmlBody;
    const subject = emailData.Subject || 'Your message';
    
    console.log('Received inbound email from:', sender);

    const { task, time, frequency } = parseReminder(body);

    const stmt = db.prepare(`
        INSERT INTO reminders (email, task, time, frequency)
        VALUES (?, ?, ?, ?)
    `);
    stmt.run(sender, task, time, frequency);

    scheduleReminder({ email: sender, task, time, frequency });

    await client.sendEmail({
        From: process.env.SENDER_EMAIL,
        To: sender,
        Subject: 'We received your message!',
        TextBody: `You said: "${body}"\n\nWe'll remind you to: ${task} at ${time} (${frequency}).`
    });
}

module.exports = { handleIncomingEmail };
