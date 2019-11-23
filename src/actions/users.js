const logger = require('../modules/logger').getLogger();

const cdUsers = require('../app-id-api/cd-users-resource').instance;
const {select, text} = require('../ux');

async function title() {
    return `Users`;
}

async function perform() {
    const action = await select({
        message: `What would you like to do?`,
        choices: [
            {name: 'Create new user', value: 'CREATE'},
            {name: '< Back', value: false}
        ]
    });

    switch(action) {
        case 'CREATE':
            const email = await text('Enter email:');
            const password = await text('Password:');
            const givenName = await text('First name:');
            const familyName = await text('Last name:');
            const result = await cdUsers.create({email, password, givenName, familyName});
            break;
    }
}

module.exports = {title, perform};
