const fs            = require('fs');
const path          = require('path');
const versionParser = require('../utils/version-parser');
const logger        = require('../utils/logger');

let releases = [];
let releasesDirectory;

module.exports.init = (_releasesDirectory) => {

    releasesDirectory = _releasesDirectory;

    if(!fs.existsSync(releasesDirectory))
        fs.mkdirSync(releasesDirectory);

    fs.readdir(releasesDirectory, (err, files) => {

        files.forEach(directory => {

            if(!fs.lstatSync(path.join(releasesDirectory, directory)).isDirectory())
                return;

            const parsedVersion = versionParser(directory);

            if(!parsedVersion)
                return;

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
            logger.info("Release added", versionEntry);

        });

    });

};

module.exports.getReleaseDirectoryName = () => releasesDirectory;

module.exports.update = (r) => module.exports.init(r || releasesDirectory);

module.exports.get = (currentVersion) => {

    if(!currentVersion) return null;

    if(releases.length === 0)
        return null;

    const found = releases.reduce(
        (prev, cur) => 
        prev.versionDecimal < cur.versionDecimal && 
        cur.target === currentVersion.target ? cur : prev);

    return found.target === currentVersion.target ? found : null;

};