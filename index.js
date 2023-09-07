const express = require('express');
const app = express();
const fs = require('fs');
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

const createTrainPayload = {
    trainExpressName: "Some train name",
    countryOfOrigin: "Example country",
    yearOfConstruction: "2137",
    maxKilometerPerHour: "320",
    destinationFrom: "Earth",
    destinationTo: "Moon",
}

app.post('/trains',(req, res) => {

    try{
        fs.readFile('data/trains.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Błąd odczytu danych.' });
                return;
            }
            try {
                const trainList = JSON.parse(data);

                // Generowanie identyfikatora dla kolejnego pociągu
                const newId = (trainList.length + 1).toString();

                // Tworzenie nowego obiektu pociągu z nowym identyfikatorem
                const newTrain = {
                    id: newId,
                    // Wykorzystywane w Postmanie
                    // ...req.body,
                    ...createTrainPayload,
                };

                trainList.push(newTrain);

                fs.writeFile('data/trains.json', JSON.stringify(trainList, null, 2), 'utf8', (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: 'Błąd podczas zapisu danych.' });
                    } else {
                        res.json(trainList);
                    }
                });


            } catch (parseError) {
                console.error(parseError);
                res.status(500).json({ error: 'Błąd parsowania danych JSON.' });
            }

        });

    }catch (err) {
        console.log('Niestety pojawił się błąd', err);
    }
})

app.listen(PORT, () => {
    console.log('Server listening on port http://localhost:4000')
})