const homedir = require('os').homedir();
const assert = require('assert');
const rm = require('rimraf');

const Context = require('../../src/modules/context').clazz;
const IAMResource = require('../../src/ibm-cloud-api/iam').clazz;

const CLI_DIR = `${homedir}/.app-id-cli`;

const TOKEN = 'eyJraWQiOiIyMDE5MDcyNCIsImFsZyI6IlJTMjU2In0.eyJpYW1faWQiOiJJQk1pZC01NTAwMDNCTUJZIiwiaWQiOiJJQk1pZC01NTAwMDNCTUJZIiwicmVhbG1pZCI6IklCTWlkIiwiaWRlbnRpZmllciI6IjU1MDAwM0JNQlkiLCJnaXZlbl9uYW1lIjoiVGFsIiwiZmFtaWx5X25hbWUiOiJBdmllbCIsIm5hbWUiOiJUYWwgQXZpZWwiLCJlbWFpbCI6InRhbEBpYm0uY29tIiwic3ViIjoidGFsQGlibS5jb20iLCJhY2NvdW50Ijp7InZhbGlkIjp0cnVlLCJic3MiOiJmZDU0YjQ1ZGQ3Nzc0YzBmODNlODk0YmQ3NTM2MGNmOSJ9LCJpYXQiOjE1NzM3NzYwMzgsImV4cCI6MTU3Mzc3OTYzOCwiaXNzIjoiaHR0cHM6Ly9pYW0uY2xvdWQuaWJtLmNvbS9vaWRjL3Rva2VuIiwiZ3JhbnRfdHlwZSI6InVybjppYm06cGFyYW1zOm9hdXRoOmdyYW50LXR5cGU6YXBpa2V5Iiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiZGVmYXVsdCIsImFjciI6MSwiYW1yIjpbInB3ZCJdfQ.oq-M-v5iZp5xJ2UI2bxbpJgnR2wa8tPQ_8qO8nYMFD2tYIOQ97ipALrU4iJt_Ius5CKLAmea215RfaqO9XA0la4P7_Ln9ttssIw3_4NT4PttFPIFutuhGZU9obRuZHEcVQ-jCaeKrBE_MGkV2efd4TtAF_Nh_B_N8k_9lWqQ0a1k_NhcUx9jFz84IH1zkVwLAcO0s1p5AFhyIqaJM5hBBUdT1gCpp-QEdGvjUU-lDxBhZzncDAZ-lLcUGhCdTW7ZqLpdJj3X5kwwhpSDdIBZ5VpB54GoeubyNY8Of3WpZm1qKZA3w1PyW_VyE_azjBSUaDuGw6PpkUV1m1TM556xgg';

let rpToken = TOKEN;

async function rp() {
    return {
        access_token: rpToken,
        expiration: Date.now() / 1000 + 3600
    }
}

describe('Context', () => {
    describe('@init', () => {

        let context;

        beforeEach(async () => {
            rm.sync(CLI_DIR);
            rpToken = TOKEN;
            context = new Context({iam: new IAMResource({rp})});
        });

        it('should create a new context file', async () => {
            await context.init();

            const cntx = require(`${CLI_DIR}/context.json`);

            assert.strictEqual(JSON.stringify(cntx), '{}');
        });

        it('should call IAM api to get access token', async () => {
            await context.init();
            assert.strictEqual(await context.getIAMAccessToken(), TOKEN);
        });

        it('should get 2nd IAM token from cache', async () => {
            await context.init();
            await context.getIAMAccessToken();
            rpToken = null;
            await context.getIAMAccessToken();
            assert.strictEqual(await context.getIAMAccessToken(), TOKEN);
        });

        it('after 2nd init should get IAM token from context', async () => {
            await context.init();
            await context.getIAMAccessToken();
            rpToken = 'invalid_token';
            await context.init();
            assert.strictEqual(await context.getIAMAccessToken(), TOKEN);
        });
    });
});
