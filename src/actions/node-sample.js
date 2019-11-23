const inquirer = require('inquirer');
const logger = require('../modules/logger').getLogger();

const sample = require('../modules/node-sample').instance;

const {select} = require('../ux/select');

async function title() {
    return 'Run Getting Started sample (nodeJS)';
}

async function perform() {
    await sample.startSample();

    await select({
        message: `Would you like to do anything else?`,
        choices: ['Back']
    });

    sample.stop();
}

module.exports = {title, perform};
