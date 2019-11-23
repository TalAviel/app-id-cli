module.exports = {
    getAppIDEndpoint: (regionId, staging = false) => { //TODO
        let test = staging ? '.test' : '';
        return `https://${regionId}.appid${test}.cloud.ibm.com`
    },
    getManagementEndpoint: (instance, staging=false) => {
        const appIdEndpoint = module.exports.getAppIDEndpoint(instance.region_id, staging);
        return `${appIdEndpoint}/management/v4/${instance.guid}`;
    }
};
