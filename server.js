const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/save-message', (req, res) => {
    const message = req.body.message + "\n"; // Add newline for each message

    fs.appendFile('messages.txt', message, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving message');
        }
        res.send('Message saved successfully');
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});