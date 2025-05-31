require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { handleIncomingEmail } = require('./mailHandler');

const app = express();
const db = require('./db');

app.use(bodyParser.json());


app.post('/inbound-email', async (req, res) => {
    try {
        await handleIncomingEmail(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error('Error handling inbound email:', err);
        res.sendStatus(500);
    }
});



app.get('/reminders', (req, res) => {
    const reminders = db.prepare('SELECT * FROM reminders ORDER BY created_at DESC').all();
    res.json(reminders);
});


app.listen(3000, () => console.log("MedReminder server running on port 3000"));
