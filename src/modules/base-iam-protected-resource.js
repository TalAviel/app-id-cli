const logger = require('../modules/logger').getLogger();

module.exports = class BaseIamProtectedResource {
    constructor({rp, context}) {
        this.context = context;
        this.rp = rp;
    }

    async request(options) {
        logger.debug('Making management request');

        const requestOptions = {
            uri: `${this.baseURL}`,
            headers: {
                Authorization: `Bearer ${await this.context.getIAMAccessToken()}`
            },
            json: true,
            ...options
        };

        if (options.uri) {
            requestOptions.uri = options.uri;
        } else if(options.suffix) {
            requestOptions.uri = `${this.baseURL}${options.suffix}`;
        }

        logger.debug(requestOptions);

        const result = await this.rp(requestOptions);

        return result;
    }

    async get(suffix) {
        return await this.request({suffix});
    }

    async put(body, suffix) {
        const options = {
            method: 'PUT',
            body
        };
        if (suffix) {
            options.suffix = suffix;
        }
        return await this.request(options);
    }

    async delete(suffix) {
        const options = {
            method: 'DELETE',
        };
        if (suffix) {
            options.suffix = suffix;
        }
        return await this.request(options);
    }

    async post(body, suffix) {
        const options = {
            method: 'POST',
            body
        };
        if (suffix) {
            options.suffix = suffix;
        }
        return await this.request(options);
    }
};
