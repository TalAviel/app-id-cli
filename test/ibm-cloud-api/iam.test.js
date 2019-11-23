const IAMResource = require('../../src/ibm-cloud-api/iam').clazz;

const TOKEN = 'eyJraWQiOiIyMDE5MDcyNCIsImFsZyI6IlJTMjU2In0.eyJpYW1faWQiOiJJQk1pZC01NTAwMDNCTUJZIiwiaWQiOiJJQk1pZC01NTAwMDNCTUJZIiwicmVhbG1pZCI6IklCTWlkIiwiaWRlbnRpZmllciI6IjU1MDAwM0JNQlkiLCJnaXZlbl9uYW1lIjoiVGFsIiwiZmFtaWx5X25hbWUiOiJBdmllbCIsIm5hbWUiOiJUYWwgQXZpZWwiLCJlbWFpbCI6InRhbEBpYm0uY29tIiwic3ViIjoidGFsQGlibS5jb20iLCJhY2NvdW50Ijp7InZhbGlkIjp0cnVlLCJic3MiOiJmZDU0YjQ1ZGQ3Nzc0YzBmODNlODk0YmQ3NTM2MGNmOSJ9LCJpYXQiOjE1NzM2ODE0MzcsImV4cCI6MTU3MzY4NTAzNywiaXNzIjoiaHR0cHM6Ly9pYW0uY2xvdWQuaWJtLmNvbS9vaWRjL3Rva2VuIiwiZ3JhbnRfdHlwZSI6InVybjppYm06cGFyYW1zOm9hdXRoOmdyYW50LXR5cGU6YXBpa2V5Iiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiZGVmYXVsdCIsImFjciI6MSwiYW1yIjpbInB3ZCJdfQ.ouYgoZvLRcilvlTrP-UPsB9ltKTaxloosy2aR6BxpEMGd3UxTib6Hb0jnVB8IwHCvBGVil3ma1qpZdhkZxUlsFki_VwzCPfKqXDboxmM6H5f8XfCuM07PlzgNuMH-CBRaRUXFLRJ_KIssT058VSj7KaDBuMOfaqIGFwxh8RbtSfqATHZVm4Ph7kmLko_t2A7fwUpxzVklzGvV2FoGR9PiN8ZamEUfOpIQusZ82GcWPzyFpuiZeObmDi-6lOmWPRJbVwqwveMApsHczxsMqhIxEIhe7L45B3KGBXc-g_GkexF-MKNh_VdnyJ2E-3vSizurMoHragumkfsNsNeEbiJcg';

function rp() {
    return {
        access_token: TOKEN
    }
}

describe('iam.js', () => {
    describe('@init', () => {
        it('should create app-id-cli directory', async () => {
            let iamResource = new IAMResource({rp});
            try {
                await iamResource.init();
            } catch(e) {
                console.log(e);
            }
        });
    });
});
