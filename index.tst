const express = require('express');
const app = express();
const fs = require('fs').promises;
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 4000

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello from Nerdbord!')
})

app.get('/trains', (req, res) => {
    fs.readFile('data/trains.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Data read error.' });
            return;
        }

        try {
            const trains = JSON.parse(data);
            res.json(trains);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).json({ error: 'JSON parsing error.' });
        }
    });
});

// const createTrainPayload = {
//     trainExpressName: "Some train name",
//     countryOfOrigin: "Example country",
//     yearOfConstruction: "2137",
//     maxKilometerPerHour: "320",
//     destinationFrom: "Earth",
//     destinationTo: "Moon",
// }

app.post('/trains',(req, res) => {

    try{
        fs.readFile('data/trains.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Data read error.' });
                return;
            }
            try {
                const trainList = JSON.parse(data);

                // Generowanie identyfikatora dla kolejnego pociągu
                const newId = (trainList.length + 1).toString();

                // Tworzenie nowego obiektu pociągu z nowym identyfikatorem
                const newTrain = {
                    id: newId,
                    ...req.body,
                };

                trainList.push(newTrain);

                fs.appendFile('data/trains.json', JSON.stringify(trainList, null, 2) + '\n', 'utf8', (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: 'Data write error.' });
                    } else {
                        res.json(trainList);
                    }
                });


            } catch (parseError) {
                console.error(parseError);
                res.status(500).json({ error: 'JSON parsing error.' });
            }

        });

    }catch (err) {
        console.log('An error occurred.', err);
    }
})

app.listen(PORT, () => {
    console.log('Server listening on port http://localhost:4000')
})