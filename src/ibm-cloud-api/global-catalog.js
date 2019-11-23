const rp = require('request-promise');
const context = require('../modules/context').instance;
const BaseIamProtectedResource = require('../modules/base-iam-protected-resource');

class GlobalCatalog extends BaseIamProtectedResource {
    constructor({context, rp}) {
        super({rp, context});
    }

    get baseURL() {
        if (context.isStaging()) {
            return 'https://globalcatalog.test.cloud.ibm.com/api/v1/AdvancedMobileAccess-d6aece47-d840-45b0-8ab9-ad15354deeea?depth=2';
        } else {
            return 'https://globalcatalog.cloud.ibm.com/api/v1/AdvancedMobileAccess-d6aece47-d840-45b0-8ab9-ad15354deeea?depth=2';
        }
    }

    async getPlans() {
        const response = await super.get();
        const plans = response.children;
        return plans.map(p => {
            return {
                name: p.name,
                id: p.id
            }
        });
    }
}

// (async () => {
//     await context.init();
//     const gc = new GlobalCatalog({context, rp});
//     console.log(await gc.getPlans());
// })();

module.exports = {
    instance: new GlobalCatalog({context, rp}),
    clazz: GlobalCatalog
};
