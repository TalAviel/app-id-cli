const rp = require('request-promise');
const context = require('../modules/context').instance;
const BaseIamProtectedResource = require('../modules/base-iam-protected-resource');

class ResourceManager extends BaseIamProtectedResource {
    constructor({context, rp}) {
        super({rp, context});
    }

    get baseURL() {
        if (context.isStaging()) {
            return 'https://resource-controller.test.cloud.ibm.com/v2/resource_groups';
        } else {
            return 'https://resource-controller.cloud.ibm.com/v2/resource_groups'
        }
    }

    async getRGs() {
        const response = await super.get();
        return response.resources.map(r => {
            return {
                name: r.name,
                id: r.id
            }
        });
    }
}

module.exports = {
    instance: new ResourceManager({context, rp}),
    clazz: ResourceManager
};
