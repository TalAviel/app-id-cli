const fs = require('fs');
const homedir = require('os').homedir();
const cloudUrls = require('../modules/cloud-urls');
const iam = require('../ibm-cloud-api/iam').instance;
const logger = require('../modules/logger').getLogger();
const {mkdirf} = require('../utils/files');

const CLI_DIR = `${homedir}/.app-id-cli`;

class Context {

    constructor({iam}) {
        this.iam = iam;
        this.staging = false;
    }

    useStaging() {
        this.staging = true;
    }

    useProduction() {
        this.staging = false;
    }

    isStaging() {
        return this.staging;
    }

    async init() {
        await mkdirf(CLI_DIR);
        try {
            this.context = JSON.parse(fs.readFileSync(`${CLI_DIR}/context.json`, 'utf-8'));
            logger.debug('context loaded from disk');
            logger.debug(this.context);
        } catch (e) {
            if (e.code === 'ENOENT') {
                logger.debug('no context');
                this.context = {staging: {}};
                await this._saveContext();
            }
        }
    }

    async getContext() {
        return this.staging ? this.context.staging : this.context;
    }

    async getInstance() {
        const cntx = await this.getContext();
        return cntx.instance;
    }

    async getIAMAccessToken() {
        let cntx = await this.getContext();
        if (cntx.iam && !isAboutToExpire(cntx.iam.expiration)) {
            logger.debug('Got IAM token from context');
            return cntx.iam.token;
        } else {
            logger.debug('Getting new IAM token');
            const result = await this.iam.getToken(this.getIAMKeys(), this.staging);
            await this._updateToken(result);
            return result.token;
        }
    }

    setIAMKeys(keys) {
        this.iamKeys = keys;
    }

    getIAMKeys() {
        return this.iamKeys
    }

    async _updateToken({token, expiration}) {
        const cntx = await this.getContext();
        cntx.iam = {token, expiration};
        await this._saveContext();
    }

    async updateInstance(instance) {
        const cntx = await this.getContext();
        cntx.instance = instance;
        await this._saveContext();
    }

    async _saveContext() {
        logger.debug('Writing context to disk');
        fs.writeFileSync(`${CLI_DIR}/context.json`, JSON.stringify(this.context));
    }

    async getCurrentInstanceManagementURL() {
        const instance = (await this.getContext()).instance;
        return cloudUrls.getManagementEndpoint(instance, this.isStaging());
    }

}

function isAboutToExpire(expiration, minutes = 10) {
    return (expiration - Date.now() / 1000) < minutes * 60;
}

module.exports = {
    instance: new Context({iam}),
    clazz: Context
};
