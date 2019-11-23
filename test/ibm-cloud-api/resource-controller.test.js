const rp = require('request-promise');
const assert = require('assert');

const ResourceConroller = require('../../src/ibm-cloud-api/resource-controller').clazz;


describe('resource-controller.js', () => {
    it('should return list of app id instances', async () => {
        const rc = new ResourceConroller({
            iam: {
                getToken: () => 'eyJraWQiOiIyMDE5MDcyNCIsImFsZyI6IlJTMjU2In0.eyJpYW1faWQiOiJJQk1pZC01NTAwMDNCTUJZIiwiaWQiOiJJQk1pZC01NTAwMDNCTUJZIiwicmVhbG1pZCI6IklCTWlkIiwiaWRlbnRpZmllciI6IjU1MDAwM0JNQlkiLCJnaXZlbl9uYW1lIjoiVGFsIiwiZmFtaWx5X25hbWUiOiJBdmllbCIsIm5hbWUiOiJUYWwgQXZpZWwiLCJlbWFpbCI6InRhbEBpYm0uY29tIiwic3ViIjoidGFsQGlibS5jb20iLCJhY2NvdW50Ijp7InZhbGlkIjp0cnVlLCJic3MiOiJmZDU0YjQ1ZGQ3Nzc0YzBmODNlODk0YmQ3NTM2MGNmOSJ9LCJpYXQiOjE1NzM2ODQxMzcsImV4cCI6MTU3MzY4NzczNywiaXNzIjoiaHR0cHM6Ly9pYW0uY2xvdWQuaWJtLmNvbS9vaWRjL3Rva2VuIiwiZ3JhbnRfdHlwZSI6InVybjppYm06cGFyYW1zOm9hdXRoOmdyYW50LXR5cGU6YXBpa2V5Iiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiZGVmYXVsdCIsImFjciI6MSwiYW1yIjpbInB3ZCJdfQ.M0PX-RoviL4Yw92wgci-BdNtJ3VMAbnR19XD5-g8GxuZBDaipBH65EEEAmg90T610bQr1Zu9KFV86u1lbJQmj6JFQUfiw9firBFBvlfwcCmJgFHgAb3mxXdyRk9iaDVf46dgrvQW2uZRP-IBK4dvt2AzfQ5jFMlJwLHio4b1FXGauKu5ekiWXMXpEeT0tSJ5IJ0MOw7l9LmBRpnoOVzeD-IjhZ1E1t_cPDOykTZYbu7pblGDavKrjgF3Z0ZiwReheCtpPONLSAOV01kAk74Y3I4U4XXn4GLyuSoiwFnY_gNTB686hb6hn3fTS-vBJl1AvkYAwoKIMA83Etem3pcHVA'
            },
            rp: () => {
                return {
                    "rows_count": 2,
                    "next_url": null,
                    "resources": [
                        {
                            "guid": "6cb68323-5cc7-4418-aecc-5160013e0df5",
                            "created_at": "2019-06-17T22:05:23.09565389Z",
                            "name": "app-id-dallas-grad",
                            "region_id": "us-south",
                            "crn": "crn:v1:bluemix:public:appid:us-south:a/fd54b45dd7774c0f83e894bd75360cf9:6cb68323-5cc7-4418-aecc-5160013e0df5::",
                        },
                        {
                            "guid": "28dcd203-308a-45fb-b43e-d2a05ca60d5e",
                            "created_at": "2019-09-09T19:04:09.707537189Z",
                            "name": "app-id-wdc",
                            "region_id": "us-east",
                            "crn": "crn:v1:bluemix:public:appid:us-east:a/fd54b45dd7774c0f83e894bd75360cf9:28dcd203-308a-45fb-b43e-d2a05ca60d5e::",
                        }
                    ]
                }
            }
        });
        const instances = await rc.getAppIdInstances();
        const firstInstance = instances.filter(i => i.crn === 'crn:v1:bluemix:public:appid:us-south:a/fd54b45dd7774c0f83e894bd75360cf9:6cb68323-5cc7-4418-aecc-5160013e0df5::');
        const secondInstance = instances.filter(i => i.crn === 'crn:v1:bluemix:public:appid:us-east:a/fd54b45dd7774c0f83e894bd75360cf9:28dcd203-308a-45fb-b43e-d2a05ca60d5e::');
        assert.strictEqual(firstInstance.length, 1);
        assert.strictEqual(secondInstance.length, 1);
    });
});
