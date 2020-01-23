const context = require('../modules/context').instance;
const logger = require('../modules/logger').getLogger();
const {text} = require('../ux');
const fs = require('fs');
const {IAM_KEYS_FILE} = require('../constants');

async function getApiKey(iamKeysFileContent, key, promptMessage) {
    let iamKey;
    if (process.env[key]) {
        iamKey = process.env[key];
    } else if (iamKeysFileContent[key]) {
        iamKey = iamKeysFileContent[key];
    } else if(promptMessage) { // ask for credentials, just if message provided.
        logger.info(`Can not find platform API key. (Looking for environment variable ${key} first, then in ${IAM_KEYS_FILE})`);
        iamKey = await text(promptMessage);
    }
    return iamKey;
}

module.exports = async function() {
    let iamKeysFileContent = {};
    try {
        const fileContent = fs.readFileSync(IAM_KEYS_FILE, 'utf-8');
        iamKeysFileContent = JSON.parse(fileContent);
    } catch (e) {
    }

    const API_KEY = await getApiKey(iamKeysFileContent, 'API_KEY', 'Please enter your platform IAM key');
    const API_KEY_STAGING = await getApiKey(iamKeysFileContent, 'API_KEY_STAGING');

    const keys = {API_KEY, API_KEY_STAGING};

    fs.writeFileSync(IAM_KEYS_FILE, JSON.stringify(keys));

    context.setIAMKeys(keys);

    return keys;
};
