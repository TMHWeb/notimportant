const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const LOG_FILE = 'logs.txt';

function logRequest(status) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] result: ${status}\n`;
    
    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) console.error('failed to log:', err);
    });
}

app.post('/verify', (req, res) => {
    logRequest("SUCCESS");
    res.status(200).send('ok');
});

app.get('/stats', (req, res) => {
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        if (err) return res.send("No logs yet.");
        const lines = data.trim().split('\n');
        const successes = lines.filter(l => l.includes('SUCCESS')).length;
        const fails = lines.filter(l => l.includes('FAIL')).length;
        res.send(`total Requests: ${lines.length} | Successes: ${successes} | Fails: ${fails}`);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
