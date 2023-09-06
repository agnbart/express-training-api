const express = require('express')
const app = express()
const fs = require('fs')

const PORT = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('Hello from Nerdbord!')
})

app.get('/trains', (req, res) => {
    fs.readFile('data/trains.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Błąd odczytu danych.' });
            return;
        }

        try {
            const trains = JSON.parse(data);
            res.json(trains);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).json({ error: 'Błąd parsowania danych JSON.' });
        }
    });
});

app.listen(PORT, () => {
    console.log('Server listening on port http://localhost:4000')
})
