const logger = require('../modules/logger').getLogger();

const {select} = require('../ux');

const sso = require('./sso');
const mfa = require('./mfa');


async function title() {
    return 'Configure Instance';
}

async function perform() {
    const actions = [sso, mfa];
    let choices = [];
    for (let action of actions) {
        choices.push({
            name: await action.title(), //TODO promise.all
            value: action.perform
        });
    }
    choices.push({name: '< Back', value: -1});

    const action = await select({
        message: `Configure`,
        choices
    });

    if (action && action !== -1) {
        await action();
    }
}

module.exports = {title, perform};
