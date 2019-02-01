const Joi = require('joi');

const schema = Joi.object().keys({
    target: Joi.string().alphanum().min(1).max(30).required(),
    major: Joi.number().integer().min(0).required(),
    minor: Joi.number().integer().min(0).required(),
    patch: Joi.number().integer().min(0).required(),
    versionDecimal: Joi.number().integer().required()
});

module.exports = (versionStr) => {

    try {
        const parts = versionStr.split('-');
        const v = parts[0].split('.');

        let response = {
            target: parts[1],
            major: parseInt(v[0]),
            minor: parseInt(v[1]),
            patch: parseInt(v[2])
        };

        response.versionDecimal = response.major * 100 + response.minor * 10 + response.patch;

        const validation = Joi.validate(response, schema);

        return validation.error ? null : response;

    }
    catch (e) {
        return null;
    }

};