const prompts = require('prompts');

/**
 * @param message - message displayed to user - string / async function to retrieve that string
 * @param choices {name, value} where name/value can be either a string or an async function
 * */
async function select({message, choices}) {
    let uxMesage = await getString(message);

    let uxChoices = [];
    for (let choice of choices) {
        if (typeof (choice) === 'string') {
            uxChoices.push(choice);
        } else {
            uxChoices.push({
                title: await getString(choice.name),
                value: choice.value
            })
        }
    }

    const response = await prompts({
        type: 'select',
        name: 'q',
        message: uxMesage,
        choices: uxChoices
    });
    return response.q;
}

async function getString(stringOrAsyncFunction) {
    if (typeof (stringOrAsyncFunction) === 'function') {
        return await stringOrAsyncFunction();
    } else {
        return stringOrAsyncFunction;
    }
}

module.exports = {select};
