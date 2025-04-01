const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to SQLite DB (stored as messages.db in root)
const db = new sqlite3.Database(path.join(__dirname, 'messages.db'), (err) => {
    if (err) {
        return console.error("Error opening database:", err.message);
    }
    console.log("✅ Connected to SQLite database.");
});

// Create messages table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// POST route to save message
app.post('/save-message', (req, res) => {
    const message = req.body.message;
    if (!message || message.trim() === "") {
        return res.status(400).send("Message is empty");
    }

    db.run(`INSERT INTO messages (content) VALUES (?)`, [message], function(err) {
        if (err) {
            console.error("❌ DB Error:", err.message);
            return res.status(500).send("Error saving message");
        }
        console.log(`📥 Saved message ID ${this.lastID}:`, message);
        res.send("Message saved successfully");
    });
});

// Optional route to fetch all messages
app.get('/messages', (req, res) => {
    db.all(`SELECT * FROM messages ORDER BY timestamp DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error fetching messages");
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
