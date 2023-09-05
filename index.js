const express = require('express')
const app = express()

const PORT = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('Hello from Nerdbord!')
})

app.listen(PORT, () => {
    console.log('Server listening on port 3000')
})
