const TOKEN_ENDPOINT = 'https://iam.cloud.ibm.com/oidc/token';
const TOKEN_ENDPOINT_STAGING = 'https://iam.test.cloud.ibm.com/oidc/token';

const rp = require('request-promise');
const logger = require('../modules/logger').getLogger();
const context = require('../modules/context').instance;

class IAMResource {
    constructor({rp, context}) {
        this.rp = rp;
        this.context = context;
    }

    async getToken(iamKeys, staging=false) {
        logger.info('Making HTTP request to IAM to get new token');
        const {API_KEY, API_KEY_STAGING} = iamKeys;
        const response = await this.rp({
            uri: staging ? TOKEN_ENDPOINT_STAGING : TOKEN_ENDPOINT,
            method: 'POST',
            form: {
                'grant_type': 'urn:ibm:params:oauth:grant-type:apikey',
                'apikey': staging ? API_KEY_STAGING : API_KEY
            },
            json: true
        });
        const accessToken = response.access_token;
        if (!accessToken) {
            logger.debug('Response returned from IAM');
            logger.debug(response);
            throw new Error('Can not get access token from IAM');
        }
        this.token = accessToken;
        this.expiration = response.expiration;

        return {
            token: response.access_token,
            expiration: response.expiration
        };
    }
}

module.exports = {
    instance: new IAMResource({rp, context}),
    clazz: IAMResource
};
