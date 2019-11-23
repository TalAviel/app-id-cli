const context = require('../modules/context').instance;
const BaseAppIDResource = require('./base-app-id-mgmt-resource').clazz;

class CdUsersResource extends BaseAppIDResource {
    constructor({context}) {
        super({context, suffix: 'cloud_directory/Users'});
    }

    async create({givenName, familyName, email, password}) {
        return await super.post({
            password,
            emails: [{value: email, primary: true}],
            name: {
                givenName,
                familyName
            }
        })
    }
}

module.exports = {
    instance: new CdUsersResource({context}),
    clazz: CdUsersResource
};
