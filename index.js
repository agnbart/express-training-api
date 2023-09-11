const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const Joi = require('joi');

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

const schema = Joi.object({
    trainExpressName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    countryOfOrigin: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    yearOfConstruction: Joi.string()
        .regex(/^\d+$/)
        .required(),
    maxKilometerPerHour: Joi.string()
        .regex(/^\d+$/)
        .required(),
    destinationFrom: Joi.string()
        .regex(/^.*$/)
        .min(2)
        .max(30)
        .required(),
    destinationTo: Joi.string()
        .regex(/^.*$/)
        .min(2)
        .max(30)
        .required(),
})

app.post('/trains', (req, res) => {
    fs.readFile('data/trains.json', 'utf8', (readErr, data) => {
        if (readErr) {
            console.error(readErr);
            res.status(500).json({ error: 'Data read error.' });
            return;
        }

        try {
            const dataToValidate = req.body;
            const {error, value} = schema.validate(dataToValidate);
            if (error) {
                console.error('Validation error.', error.details[0].message);
                res.send(error.details[0].message);
                return;
            }else {
                console.log('Correct data.', value);
            }

            const trainList = JSON.parse(data);

            let highestId = 0;
            trainList.forEach((train) => {
                const id = parseInt(train.id);
                if (!isNaN(id) && id > highestId) {
                    highestId = id;
                }
            })

            const newId = (highestId + 1).toString();

            // Tworzenie nowego obiektu pociągu z nowym identyfikatorem
            const newTrain = {
                id: newId,
                ...req.body,
            };

            trainList.push(newTrain);

            // Zaktualizuj plik z danymi JSON
            fs.writeFile('data/trains.json', JSON.stringify(trainList, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error(writeErr);
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
});

app.put('/trains/:id', (req, res) => {
    const searchId = req.params.id;
     fs.readFile('data/trains.json', 'utf8', (readErr, data) => {
        if (readErr) {
            console.error(readErr);
            res.status(500).json({ error: 'Data read error.' });
            return;
        }

        try {
            const trainList = JSON.parse(data);
            const foundIndex = trainList.findIndex(train => train.id === searchId);
            if (foundIndex !== -1) {
                const replacementTrain = req.body;
                trainList[foundIndex] = {
                    ...trainList[foundIndex],
                    ...replacementTrain
                };

                fs.writeFile('data/trains.json', JSON.stringify(trainList, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        res.status(500).json({ error: 'Data write error.' });
                    } else {
                        res.json(replacementTrain); // Zwróć zaktualizowany obiekt
                        console.log("the file content has been changed");
                    }
                });
            } else {
                res.status(404).json({ error: 'Train not found.' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Data parsing error.' });
        }
    });
});


app.listen(PORT, () => {
    console.log('Server listening on port http://localhost:4000')
});