const fs = require('fs');
const versionParser = require('../utils/version-parser');

module.exports = (req,res) => {

    const version = versionParser(req.body.major + "." + req.body.minor + "." + req.body.patch + "-" + req.body.target);
    if(!version)
        return res.status(500).send();

    if(fs.existsSync('./releases/' + version.folderName))
        return res.status(403).send("Version already present");

    fs.mkdirSync('./releases/' + version.folderName);

    fs.writeFileSync('./releases/' + version.folderName + "/" + version.filename, req.file.buffer);
    
    res.redirect('/upload.html');

};