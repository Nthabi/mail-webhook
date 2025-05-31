const chrono = require('chrono-node');

function parseReminder(text) {
    const parsedDate = chrono.parseDate(text);
    const time = parsedDate?.toTimeString()?.split(' ')[0] ?? null;

    // Basic task extraction
    const task = text.replace(/remind me to/i, '').split(/ at | every | daily | on /i)[0].trim();

    // Detect frequency
    const frequency = /daily/i.test(text) ? 'daily' : 'once';

    return { task, time, frequency };
}

module.exports = { parseReminder };
