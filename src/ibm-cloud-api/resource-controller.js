const rp = require('request-promise');
const context = require('../modules/context').instance;

const BaseIamProtectedResource = require('../modules/base-iam-protected-resource');

class ResourceConroller extends BaseIamProtectedResource {
    constructor({context, rp}) {
        super({rp, context});
    }

    get baseURL() {
        if (context.isStaging()) {
            return 'https://resource-controller.test.cloud.ibm.com/v2/resource_instances';
        } else {
            return 'https://resource-controller.cloud.ibm.com/v2/resource_instances'
        }
    }

    async provision({name, resourceGroupId, region, planId}) {
        return await super.post({
            name,
            target: region,
            resource_group: resourceGroupId,
            resource_plan_id: planId
        });
    }

    async unprovision(guid) {
        return await super.delete(`/${guid}`);
    }

    async getAppIdInstances() {
        const response = await super.request({
            qs: {
                type: 'service_instance',
                resource_id: 'AdvancedMobileAccess-d6aece47-d840-45b0-8ab9-ad15354deeea'
            }
        });

        return response.resources.map(i => {
            return {
                guid: i.guid,
                crn: i.crn,
                name: i.name,
                region_id: i.region_id,
                created_at: i.created_at
            }
        });
    }
}

module.exports = {
    instance: new ResourceConroller({context, rp}),
    clazz: ResourceConroller
};
