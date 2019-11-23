const logger = require('../modules/logger').getLogger();

const mfaResource = require('../app-id-api/mfa-resource').instance;
const {select} = require('../ux/select');

async function title() {
    const isActive = await mfaResource.isActive();
    return `Configure MFA (Status: ${isActive ? 'Enabled' : 'Disabled'})`;
}

async function perform() {
    const isActive = await select({
        message: `MFA Options`,
        choices: [
            {name: 'Enable', value: true},
            {name: 'Disable', value: false}
        ]
    });

    if (isActive) {
        logger.debug('Enabling MFA');
        await mfaResource.turnOn();
    } else {
        logger.debug('Disabling MFA');
        await mfaResource.turnOff();
    }
}

module.exports = {title, perform};
