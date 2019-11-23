const context = require('../modules/context').instance;
const BaseAppIDResource = require('./base-app-id-mgmt-resource').clazz;

const logger = require('../modules/logger').getLogger();

class ApplicationResource extends BaseAppIDResource {
    constructor({context}) {
        super({context, suffix: 'config/redirect_uris'});
    }

    async get() {
        return super.get();
    }

    async add(url) {
        const result = await super.get();
        if (!Array.isArray(result.redirectUris)) {
            result.redirectUris = [];
        }
        if (result.redirectUris.filter(r => r === url).length === 0) {
            logger.debug(`Adding ${url} to redirectUris`);
            result.redirectUris.push(url);
            await super.put(result);
        }
    }
}

module.exports = {
    instance: new ApplicationResource({context}),
    clazz: ApplicationResource
};
