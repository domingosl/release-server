const fs = require('fs');
const versionParser = require('../utils/version-parser');
const releaseManager = require('../utils/release-manager');
const path            = require('path');

module.exports = (req, res) => {

    const version = versionParser(req.body.major + "." + req.body.minor + "." + req.body.patch + "-" + req.body.target);
    if(!version)
        return res.status(500).send();

    if(fs.existsSync(path.join(releaseManager.getReleaseDirectoryName(), version.folderName)))
        return res.status(403).send("Version already present");

    fs.mkdirSync(path.join(releaseManager.getReleaseDirectoryName(), version.folderName));

    fs.writeFileSync(path.join(releaseManager.getReleaseDirectoryName(), version.folderName, version.filename), req.file.buffer);
    
    res.redirect('/upload.html');

};