const logger = require('../modules/logger').getLogger();
const tar = require('tar');
const request = require('request');
const {mkdirf, exists} = require('../utils/files');
const fs = require('fs');
const context = require('./context').instance;
const applicationResource = require('../app-id-api/applications-resource').instance;
const uris = require('../app-id-api/redirect-uri-resource').instance;
const chalk = require('chalk');

const {CLI_DIR, NODE_SAMPLE_DIR, NODE_SAMPLE_TAR_URL, NODE_SAMPLE_APPLICATION_NAME} = require('../constants');

const util = require('util');
const childProcess = require('child_process');

class NodeSample {
    constructor({request}) {
        this.request = request;
    }

    async startSample() {
        if (this.running) {
            logger.info(`Sample application is already running on http://localhost:3010`);
            return;
        }
        await this.ensureSampleAvailable();

        logger.debug('Searching for existing application');
        let app = await applicationResource.getApplicationByName(NODE_SAMPLE_APPLICATION_NAME);
        if (!app) {
            logger.debug('Creating a new application');
            app = await applicationResource.createApplication(NODE_SAMPLE_APPLICATION_NAME);
        }
        logger.debug('Application available');
        logger.debug(app);

        if (!app.clientId || !app.tenantId) {
            throw new Error('Missing clientId/tenantId');
        }
        const REDIRECT_URI = 'http://localhost:3010/ibm/cloud/appid/callback';
        app.redirectUri = REDIRECT_URI;

        fs.writeFileSync(`${NODE_SAMPLE_DIR}/localdev-config.json`, JSON.stringify(app));

        await uris.add(REDIRECT_URI);

        await this.runSample();
    }

    async runSample() {
        logger.info('Installing dependencies..');

        const output = childProcess.execSync(`cd ${NODE_SAMPLE_DIR} && npm i`, {encoding: 'utf-8'});
        logger.debug(output);

        logger.info('Starting application');

        this.child = childProcess.spawn('node', ['app'], {cwd: NODE_SAMPLE_DIR, env: {PATH: process.env.PATH, PORT: 3010}});

        this.child.stderr.on('data', (data) => {
            logger.error('There was a problem with running the sample app.');
            logger.error(data);
        });

        logger.info(chalk.green.bold(`Sample application is running on http://localhost:3010`));
        logger.info(`You can see the sample source code at ${NODE_SAMPLE_DIR}`);
        logger.info('(The application will be terminated once you either go back or close this CLI.)');

        this.running = true;
    }

    stop() {
        this.child && this.child.kill();
        this.running = false;
    }

    async ensureSampleAvailable() {
        logger.debug('Checking if sample is available locally');
        if (!(await exists(NODE_SAMPLE_DIR))) {
            await this.downloadSample();
        }
        logger.debug('Sample is ready.');
    }

    async downloadSample() {
        logger.debug('Downloading sample tarball from GitHub and extracting locally');

        logger.debug('Verifying directories exist...');
        await mkdirf(CLI_DIR);
        await mkdirf(`${CLI_DIR}/node-sample`);

        logger.debug('Downloading and extracting...');
        await new Promise((resolve, reject) => {
            this.request(NODE_SAMPLE_TAR_URL, {headers: {'User-Agent': 'request'}}).pipe(tar.x({
                C: `${CLI_DIR}/node-sample`,
                preservePaths: true,
                strip: 1
            })).on('close', () => resolve()).on('error', e => reject(e));
        });
    }

}

// (async () => {
//     try {
//         await context.init();
//
//         let sample = new NodeSample({request});
//         await sample.runSample();
//         // sample.stop();
//
//         console.log('kiilin');
//         setTimeout(() => sample.stop(), 5000);
//     } catch (e) {
//         console.error(e);
//     }
// })();


module.exports = {
    instance: new NodeSample({request}),
    clazz: NodeSample
};
