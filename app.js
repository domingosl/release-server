require('dotenv').load();

const logger        = require('./utils/logger');
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();


const github          = require('./controllers/github');
const updateFirmware  = require('./controllers/update-firmware');

const releasesManager = require('./utils/release-manager');

releasesManager.init('./releases');

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true, parameterLimit: 100}));


app.get('/update-firmware', updateFirmware);

app.post('/pull-git', github);


app.listen(process.env.SERVER_PORT, function () {
  logger.info('Server running on port ' + process.env.SERVER_PORT);
});