const context = require('../modules/context').instance;
const BaseAppIDResource = require('./base-app-id-mgmt-resource').clazz;

class MFAResource extends BaseAppIDResource {
    constructor({context}) {
        super({context, suffix: 'config/cloud_directory/mfa'});
    }

    async turnOn() {
        return await super.put({isActive: true});
    }

    async turnOff() {
        return await super.put({isActive: false});
    }

    async isActive() {
        const result = await super.get();
        return result.isActive;
    }
}

module.exports = {
    instance: new MFAResource({context}),
    clazz: MFAResource
};
