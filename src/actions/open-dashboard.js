const context = require('../modules/context').instance;
const {select} = require('../ux/select');

async function title() {
    return 'Get Dashboard Link';
}

async function perform() {
    const instance = await context.getInstance();
    const crn = instance.crn;

    console.log('------');
    console.log('Your App ID dashboard link:');
    console.log(`https://cloud.ibm.com/services/appid/${encodeURIComponent(crn)}`);
    console.log('------');

    await select({
        message: '',
        choices: ['Back']
    });
}

// (async () => {
//     await context.init();
//     await perform();
// })();

module.exports = {title, perform};
