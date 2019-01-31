module.exports = (versionStr) => {

    const parts = versionStr.split('-');
    const v = parts[0].split('.');

    let response = {
        target: parts[1],
        major: parseInt(v[0]),
        minor: parseInt(v[1]),
        patch: parseInt(v[2])
    };

    response.versionDecimal = response.major * 100 + response.minor * 10 + response.patch;

    return response;

}