const homedir = require('os').homedir();

module.exports = {
    // CLI_DIR: path.resolve(__dirname, '../.app-id-cli'),
    CLI_DIR: `${homedir}/.app-id-cli`,
    IAM_KEYS_FILE: `${homedir}/.app-id-cli/iam.json`,
    // NODE_SAMPLE_DIR: path.resolve(__dirname, '../.app-id-cli/node-sample'),
    NODE_SAMPLE_DIR: `${homedir}/.app-id-cli/node-sample`,
    NODE_SAMPLE_TAR_URL: 'https://api.github.com/repos/ibm-cloud-security/app-id-sample-node/tarball/master',
    NODE_SAMPLE_APPLICATION_NAME: 'app-id-cli-node'
};
