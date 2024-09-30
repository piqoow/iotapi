const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config();

const app = express();
const portServer = process.env.PORTSERVER || 3000;

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const appRoute = require('./src/routes/index')
app.use('/', appRoute)

app.listen(portServer, '0.0.0.0', () => {
    console.log(`Server started on port ${portServer}`);
});