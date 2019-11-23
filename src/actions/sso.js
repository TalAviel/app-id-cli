const logger = require('../modules/logger').getLogger();

const ssoResource = require('../app-id-api/sso-resource').instance;
const {select} = require('../ux');

async function title() {
    const isActive = await ssoResource.isActive();
    return `Configure SSO (Status: ${isActive ? 'Enabled' : 'Disabled'})`;
}

async function perform() {
    const isActive = await select({
        message: 'SSO Options',
        choices: [
            {name: 'Enable', value: true},
            {name: 'Disable', value: false},
            {name: '< Back', value: 0}
        ]
    });

    if (isActive === true) {
        await ssoResource.turnOn();
    } else if (isActive === false) {
        await ssoResource.turnOff();
    }
}

module.exports = {title, perform};
