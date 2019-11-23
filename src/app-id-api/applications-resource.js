const context = require('../modules/context').instance;
const BaseAppIDResource = require('./base-app-id-mgmt-resource').clazz;

class ApplicationResource extends BaseAppIDResource {
    constructor({context}) {
        super({context, suffix: 'applications'});
    }

    async getApplicationByName(name) {
        const response = await this.getAll();
        const results = response.applications.filter(app => app.name === name);
        return results.length === 1 && results[0];
    }

    async getAll() {
        return await super.get();
    }

    async createApplication(name) {
        return await super.post({ name });
    }
}

module.exports = {
    instance: new ApplicationResource({context}),
    clazz: ApplicationResource
};
