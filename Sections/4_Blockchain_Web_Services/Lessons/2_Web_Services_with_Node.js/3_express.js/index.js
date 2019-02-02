const express = require('express');
const app = express();

// Handles GET Request from client on the route "/"
app.get('/', (req, res) => res.send('Hello World!'));

// Listen on port 3000
app.listen(3000, () => console.log('Example app listening on port 3000!'));