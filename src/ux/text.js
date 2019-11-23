const prompts = require('prompts');

async function text(message) {
    const response = await prompts({
        type: 'text',
        name: 'q',
        message
    });
    return response.q;
}

module.exports = {text};
