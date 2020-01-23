#!/usr/bin/env node

const context = require('./modules/context').instance;
const actions = require('./actions/actions');

const {select} = require('./ux/select');

const logger = require('./modules/logger').getLogger();

const selectInstance = require('./actions/select-instance').perform;
const getIAMApiKey = require('./actions/set-iam-key');

class Main {
    async start() {
        await context.init();

        const iamKeys = await getIAMApiKey();
        if (!iamKeys.API_KEY && !iamKeys.API_KEY_STAGING) {
            throw new Error('Please enter IAM API keys.');
        }

        await this.showActions();
    }

    async setCurrentInstance() {
        let instance = await context.getInstance();

        if (!instance) {
            return await selectInstance();
        }
        return instance;
    }

    async showActions() {
        try {
            if (!await this.setCurrentInstance()) {
                logger.info('Instance was not selected, exiting.');
                return;
            }
        } catch(e) {
            logger.error('Error occurred.');
            logger.error(e);
            return;
        }

        let choices = [];
        for (let action of actions) {
            choices.push({
                name: await action.title(), //TODO promise.all
                value: action.perform
            });
        }
        choices.push({name: 'Exit', value: 'exit'});

        const instance = await context.getInstance();
        const action = await select({
            message: `${instance.name} - Choose action`,
            choices
        });

        if (action && action !== 'exit') {
            try {
                await action();
            } catch(e) {
                logger.error('There was an error while performing the chosen action.');
                logger.error(e);
            }
            await this.showActions();
        }

    }
}


(async () => {
    try {
        await new Main().start();
    } catch(e) {
        logger.error(e);
    }
})();
