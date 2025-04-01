// export-messages-to-csv.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('messages.db');

db.all(`SELECT content, timestamp FROM messages ORDER BY timestamp ASC`, [], (err, rows) => {
    if (err) {
        return console.error("DB error:", err);
    }

    const csvHeader = "Message,Timestamp\n";
    const csvRows = rows.map(row => {
        // Escape quotes in content
        const msg = row.content.replace(/"/g, '""');
        return `"${msg}","${row.timestamp}"`;
    });

    const csvData = csvHeader + csvRows.join('\n');
    fs.writeFileSync('exported_messages.csv', csvData);

    console.log("✅ Messages exported to exported_messages.csv");

    db.close();
});

