// Adapted from:
// https://marmelab.com/react-admin/DataProviders.html

const addUploadCapabilities = requestHandler => (type, resource, params) => {
    // For badge updates with avatars, modify avatar field
    if (type === 'UPDATE' && resource === 'badges') {
        // If avatar was uploaded
        if (params.data.avatar && params.data.avatar.length) {
            // Modify avatar field to ensure that it is not an object
            return requestHandler(type, resource, {
                ...params,
                data: {
                    ...params.data,
                    avatar: 'Upload pending'
                }
            });
        }
    }

    // For other requests, pass request onwards
    return requestHandler(type, resource, params);
};
export default addUploadCapabilities;
