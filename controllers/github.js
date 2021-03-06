const crypto = require('crypto');
const github = require('simple-git')();
const logger = require('../utils/logger');

module.exports = (req, res) => {

    logger.info("New Github hook");

    const sign = req.headers['x-hub-signature'];
    const key  = process.env.GITHUB_HOOK_SECRET;
    const hash = "sha1=" + crypto.createHmac('sha1', key).update(JSON.stringify(req.body)).digest('hex');

    if(hash === sign) {

        res.send("OK");
        logger.info("Pulling git!");
        github.pull((err, response) => {
            if (err)
                throw err;

            logger.info("Pull completed, process will exit in 3 seconds...", response.summary);

            setTimeout(() => process.exit(), 3000);

        });

    }
    else {
        res.send("KO");
        logger.info("Unable to pull, hash and signature do not match", { hash: hash, signature: sign });
    }

};