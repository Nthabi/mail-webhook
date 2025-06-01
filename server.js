require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { handleIncomingEmail } = require('./mailHandler');

const app = express();
//const db = require('./db');
const Database = require('better-sqlite3');
const db = new Database('/data/medreminders.db');

app.use(bodyParser.json());
app.use(cors());


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

app.get('/health', (req, res) => {
    res.json("App is healthy");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});



app.listen(3000, () => console.log("MedReminder server running on port 3000"));
