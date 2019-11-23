const logger = require('../modules/logger').getLogger();

const rm = require('../ibm-cloud-api/resource-manager').instance;
const rc = require('../ibm-cloud-api/resource-controller').instance;
const gc = require('../ibm-cloud-api/global-catalog').instance;
const context = require('../modules/context').instance;
const {select, text} = require('../ux');
const regions = require('../utils/regions');

async function title() {
    return 'Provision new instance...';
}

async function perform() {
    const resourceGroupId = await chooseResourceGroup();
    if (!resourceGroupId) return;

    const region = await chooseRegion();

    const planId = await choosePlan();

    const name = await text('Please type a name for your new App ID instance');

    logger.info(`Provisioning new App ID instance ${name}...`);

    const response = await rc.provision({name, resourceGroupId, region, planId});

    logger.info(`Instance provisioned. guid=${response.guid}`);

    const instance = {
        guid: response.guid,
        crn: response.crn,
        name: response.name,
        region_id: response.region_id,
        created_at: response.created_at
    };

    await context.updateInstance(instance);

    return instance;
}

async function chooseResourceGroup() {
    const resourceGroups = await rm.getRGs();

    if (resourceGroups.length === 0) {
        logger.error('You do not have any resource groups, please create one and try again.');
        return;
    } else if (resourceGroups.length === 1) {
        return resourceGroups[0].id;
    } else {
        return await select({
            message: 'Select a resource group in which App ID instance will be provisioned',
            choices: resourceGroups.map(rg => {
                return {
                    name: rg.name,
                    value: rg.id
                };
            })
        });
    }
}

async function chooseRegion() {
    return await select({
        message: 'Please select region:',
        choices: regions.map(r => {
            return {
                name: r,
                value: r
            }
        })
    });
}

async function choosePlan() {
    const plans = await gc.getPlans();

    return await select({
        message: 'Please select plan:',
        choices: plans.map(r => {
            return {
                name: r.name,
                value: r.id
            }
        })
    });
}

// (async () => {
//     await context.init();
//     await perform();
// })();

module.exports = {title, perform};
