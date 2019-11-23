const context = require('../modules/context').instance;
const rp = require('request-promise');
const logger = require('../modules/logger').getLogger();

class BaseAppIdMgmtResource {
    constructor({context, suffix}) {
        this.context = context;
        this.suffix = suffix;
    }

    async getManagementURL() {
        const managementURL = await this.context.getCurrentInstanceManagementURL();
        logger.debug(managementURL);
        return managementURL;
    }

    async managementReqeust(options) {
        logger.debug('Making management request');

        const requestOptions = {
            uri: `${await this.getManagementURL()}/${this.suffix}`,
            headers: {
                Authorization: `Bearer ${await this.context.getIAMAccessToken()}`
            },
            json: true,
            ...options
        };

        logger.debug(requestOptions);

        const result = await rp(requestOptions);

        return result;
    }

    async get() {
        return await this.managementReqeust();
    }

    async put(body) {
        return await this.managementReqeust({
            method: 'PUT',
            body
        });
    }

    async post(body) {
        return await this.managementReqeust({
            method: 'POST',
            body
        });
    }
}

module.exports = {
    instance: new BaseAppIdMgmtResource({context}),
    clazz: BaseAppIdMgmtResource
};
