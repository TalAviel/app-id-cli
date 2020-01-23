const rc = require('../ibm-cloud-api/resource-controller').instance;
const context = require('../modules/context').instance;
const {toggle} = require('../ux');

async function title() {
    return 'Delete instance';
}

async function perform() {
    const instance = await context.getInstance();
    const guid = instance.guid;

    const confirm = await toggle(`Are you sure you want to delete ${instance.name} (${guid})?`);

    if(confirm) {
        await rc.unprovision(guid);
        await context.updateInstance(null);
    }
}

// (async () => {
//     await context.init();
//     await perform();
// })();

module.exports = {title, perform};
