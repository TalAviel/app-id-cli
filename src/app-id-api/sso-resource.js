const context = require('../modules/context').instance;
const logger = require('../modules/logger').getLogger();
const BaseAppIDResource = require('./base-app-id-mgmt-resource').clazz;

class SsoResource extends BaseAppIDResource {
    constructor({context}) {
        super({context, suffix: 'config/cloud_directory/sso'});
    }

    async _update(isActive) {
        await super.put({
            isActive,
            "inactivityTimeoutSeconds": 86400,
            "logoutRedirectUris": [
                "http://localhost:3010/logout-callback"
            ]
        });
    }

    async isActive() {
        const result = await super.get();
        return result.isActive;
    }

    async turnOn() {
        logger.debug('Turning on SSO');
        await this._update(true);
    }

    async turnOff() {
        logger.debug('Turning off SSO');
        await this._update(false);
    }
}

module.exports = {
    instance: new SsoResource({context}),
    clazz: SsoResource
};
