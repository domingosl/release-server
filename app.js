require('dotenv').load();

process.title = "relser";
global.appRoot = __dirname;

const logger        = require('./utils/logger');
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
var multer          = require('multer');
var upload          = multer();

const github            = require('./controllers/github');
const updateFirmware    = require('./controllers/update-firmware');
const uploadController  = require('./controllers/upload');

const releasesManager = require('./utils/release-manager');

releasesManager.init('./releases');

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true, parameterLimit: 100}));
app.use(express.static('_'));

app.get('/update-firmware', updateFirmware);

app.post('/pull-git', github);

app.post('/upload-release', upload.single('file'), uploadController);


app.listen(process.env.SERVER_PORT, function () {
  logger.info('Server running on port ' + process.env.SERVER_PORT);
});