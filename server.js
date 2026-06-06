const express = require('express');
const fs = require('fs');
const UAParser = require('ua-parser-js'); // Make sure to run: npm install ua-parser-js
const app = express();
app.use(express.json());

const LOG_FILE = 'logs.txt';

function logRequest(status, userAgent) {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const os = result.os.name || "Unknown OS";
    const browser = result.browser.name || "Unknown Browser";
    
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] OS: ${os} | Browser: ${browser} | Result: ${status}\n`;
    
    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) console.error('failed to log:', err);
    });
}

app.post('/verify', (req, res) => {
    logRequest("SUCCESS", req.headers['user-agent']);
    res.status(200).send('ok');
});

app.get('/stats', (req, res) => {
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        if (err) return res.send("No logs yet.");
        const lines = data.trim().split('\n');
        const successes = lines.filter(l => l.includes('SUCCESS')).length;
        const fails = lines.filter(l => l.includes('FAIL')).length;
        const lastEntry = lines[lines.length - 1];
        
        res.send(`
            <h3>Anti-Cheat Stats</h3>
            <p>Total Requests: ${lines.length}</p>
            <p>Successes: ${successes}</p>
            <p>Fails: ${fails}</p>
            <hr>
            <p><strong>Last Activity:</strong> ${lastEntry}</p>
        `);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
