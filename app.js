require('dotenv').load();

const logger        = require('./logger');
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const fs            = require('fs');
const path          = require('path');
const versionParser = require('./version-parser');
const github        = require('./github');

const releasesDirectory = './releases';



app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true, parameterLimit: 100}));


let releases = [];

fs.readdir(releasesDirectory, (err, files) => {

  files.forEach(directory => {

    if(!fs.lstatSync(path.join(releasesDirectory, directory)).isDirectory())
      return;

    const parsedVersion = versionParser(directory);

    const bin = fs.readdirSync(path.join(releasesDirectory, directory)).find(file => file.slice(-4) === '.bin');

    if(!bin)
      return;

    let versionEntry = {
      target: parsedVersion.target,
      bin: path.join(releasesDirectory, directory, bin),
      major: parsedVersion.major,
      minor: parsedVersion.minor,
      patch: parsedVersion.patch,
      versionDecimal: parsedVersion.versionDecimal
    };

    releases.push(versionEntry);

  });

});

app.get('/update-firmware', function (req, res) {
  
  const currentVersion = versionParser(req.headers['x-esp8266-version']);
  const currentFirmwareHash = req.headers['x-esp8266-sketch-md5'];

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const release = releases.find(entry => entry.target === currentVersion.target && entry.versionDecimal > currentVersion.versionDecimal);

  logger.info("New firmware request.", { currentVersion: currentVersion, currentFirmwareHash: currentFirmwareHash, ip: ip });

  if(!release) {
    logger.info("No new firmware available.");
    return res.status(304).send();
  }

  logger.info("Sending new firmware.", { newVersion: release.versionDecimal });
  return res.sendFile(path.join(__dirname, release.bin));


});

app.post('/pull-git', github);

app.listen(process.env.SERVER_PORT, function () {
  logger.info('Server running on port ' + process.env.SERVER_PORT);
});