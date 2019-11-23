const prompts = require('prompts');

/**
 * @param message - message displayed to user - string / async function to retrieve that string
 * @param choices {name, value} where name/value can be either a string or an async function
 * */
async function toggle(message) {
    const response = await prompts({
        type: 'toggle',
        name: 'q',
        message,
        initial: false,
        active: 'yes',
        inactive: 'no'
    });
    return response.q;
}

module.exports = {toggle};
