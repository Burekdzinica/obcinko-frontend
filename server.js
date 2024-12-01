const express = require('express');
const cors = require('cors');

const app = express();

const port = 3000;
const obcine = require("./src/obcine.json")

app.use(cors());

app.get('/', (req, res) => {
    res.json(obcine)
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// Dont need this NOW save for later
