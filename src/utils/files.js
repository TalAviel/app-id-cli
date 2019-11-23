const fs = require('fs');
const util = require('util');

async function mkdirf(path) {
    try {
        await (util.promisify(fs.mkdir)(path))
    } catch (e) {
        if (e.code !== 'EEXIST') {
            throw e;
        }
    }
}

async function exists(path) {
    try {
        await (util.promisify(fs.stat)(path));
        return true;
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            throw e;
        }
    }
}

module.exports = {mkdirf, exists};
