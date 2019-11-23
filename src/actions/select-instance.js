const rc = require('../ibm-cloud-api/resource-controller').instance;
const context = require('../modules/context').instance;
const provision = require('../actions/provision').perform;
const {select} = require('../ux');


async function title() {
    return `Select another App ID instance`;
}

async function perform() {
    const instances = await rc.getAppIdInstances();

    const toggle = context.isStaging() ? 'production' : 'staging';
    let choices = [
        {name: 'Provision new instance...', value: -2},
        {name: `Switch to ${toggle} environment`, value: -1}
    ];

    choices = choices.concat(instances.map(i => {
        return {
            name: `${i.name} (${i.region_id}, ${i.created_at})`,
            value: i
        }
    }));

    let instance = await select({
        message: 'Choose App ID instance',
        choices
    });

    if (instance === -2) {
        instance = await provision();
    } else if (instance === -1) {
        if (context.isStaging()) {
            context.useProduction();
        } else {
            context.useStaging();
        }
        return await perform();
    }

    await context.updateInstance(instance);

    return instance;
}

module.exports = {title, perform};
