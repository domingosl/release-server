const releaseManager = require('../utils/release-manager');

module.exports = (req, res) => {


    res.render('upload.ejs', { releases: releaseManager.getAll() });


}