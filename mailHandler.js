const db = require('./db/db');
const { parseReminder } = require('./parseUtils');
const { scheduleReminder } = require('./scheduler');

async function handleIncomingEmail(emailData) {
    const sender = emailData.FromFull.Email;
    const body = emailData.TextBody || emailData.HtmlBody;

    const { task, time, frequency } = parseReminder(body);

    const stmt = db.prepare(`
        INSERT INTO reminders (email, task, time, frequency)
        VALUES (?, ?, ?, ?)
    `);
    stmt.run(sender, task, time, frequency);

    scheduleReminder({ email: sender, task, time, frequency });
}

module.exports = { handleIncomingEmail };
