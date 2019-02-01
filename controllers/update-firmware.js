const logger          = require('../utils/logger');
const path            = require('path');
const versionParser   = require('../utils/version-parser');
const releasesManager = require('../utils/release-manager');

module.exports = (req, res) => {

    const currentVersion = versionParser(req.headers['x-esp8266-version']);
    const currentFirmwareHash = req.headers['x-esp8266-sketch-md5'];
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


    if(!currentVersion || !currentFirmwareHash)
        return res.status(304).send("Invalid request format.");

    const release = releasesManager.get(currentVersion);

    logger.info("New firmware request.", { currentVersion: currentVersion, currentFirmwareHash: currentFirmwareHash, ip: ip });

    if(!release) {
        logger.info("No new firmware available.");
        return res.status(304).send();
    }

    logger.info("Sending new firmware.", { newVersion: release.versionDecimal });
    return res.sendFile(path.join(__dirname, release.bin));


};