// Data provider for app
// Adapted from react-admin source code, licensed under MIT

import { stringify } from 'query-string';
import { GET_LIST, GET_ONE, CREATE, UPDATE, GET_MANY } from 'react-admin';

// Set and export API URL
if (!process.env.REACT_APP_API_URL) {
    console.error('Warning: API URL not set');
}
const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export { apiURL };

/**
 * Maps react-admin queries to my REST API
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a data response
 */
export default (type, resource, params) => {
    // Initialise the URL
    let url = '';

    // Specify default request options
    let options = {
        headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }),
        credentials: 'include'
    };

    switch (type) {
        // Get list of resource
        case GET_LIST: {
            // Extract attributes from passed in parameters
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;

            // Set sort
            let sort;
            if (order === 'ASC') {
                sort = field;
            } else if (order === 'DESC') {
                sort = '-' + field;
            }

            // Set offset/limit
            const offset = (page - 1) * perPage;
            const limit = page * perPage - 1 - (page - 1) * perPage + 1;

            // Build query
            let query = {
                sort: sort,
                offset: offset,
                limit: limit
            };
            query = Object.assign(params.filter, query);

            // Convert query to URL
            url = `${apiURL}/${resource}?${stringify(query)}`;
            break;
        }
        // Get specific (one) resource
        case GET_ONE:
            url = `${apiURL}/${resource}/${params.id}`;
            break;
        // Create resource
        case CREATE:
            url = `${apiURL}/${resource}`;
            options.method = 'POST';
            options.body = JSON.stringify(params.data);
            break;
        // Update resource
        case UPDATE:
            url = `${apiURL}/${resource}/${params.id}`;
            options.method = 'PUT';

            // Update badge avatar, if applicable
            if (params.data.avatar && resource === 'badges') {
                // Define options
                const avatarOptions = {
                    headers: new Headers({
                        Accept: 'application/json'
                    }),
                    method: 'PUT',
                    credentials: 'include'
                };

                // Init FormData
                // https://stackoverflow.com/questions/49579640
                const fd = new FormData();
                fd.append('avatar', params.data.avatar.rawFile);
                avatarOptions.body = fd;

                // Send request and delete avatar for following update request
                // (for the rest of the resource)
                fetch(
                    `${apiURL}/${resource}/${params.id}/avatar`,
                    avatarOptions
                ).then(() => {});
                delete params.data.avatar;
            }

            // Define update request
            options.body = JSON.stringify(params.data);
            break;
        // Get many of resource
        case GET_MANY: {
            // Join IDs together to form 'ids' query field
            const query = {
                ids: params.ids.join(',')
            };
            url = `${apiURL}/${resource}?${stringify(query)}`;
            break;
        }
        default:
            throw new Error(`Unsupported Data Provider request type ${type}`);
    }

    // Send request to API
    return fetch(url, options)
        .then(async res => {
            // Convert response to JSON and extract headers from response
            return {
                response: await res.json(),
                headers: res.headers
            };
        })
        .then(res => {
            // Extract headers/response from previous step
            const { headers, response } = res;

            switch (type) {
                // If the type is GET_LIST
                case GET_LIST: {
                    // Retrieve content-range header for pagination
                    if (!headers.has('content-range')) {
                        throw new Error('Content Range not set');
                    }
                    // Extract total (the number of items) from header
                    let total = parseInt(
                        headers
                            .get('content-range')
                            .split('/')
                            .pop(),
                        10
                    );

                    // Extract and return data with total
                    return {
                        data: response[Object.keys(response)],
                        total: total
                    };
                }
                case GET_MANY:
                    // Extract and return data
                    return {
                        data: response[Object.keys(response)]
                    };
                case GET_ONE:
                    // If the resource is a badge and the badge has an avatar
                    if (resource === 'badges' && response.avatar) {
                        // Get URL of avatar
                        const avatarURL = apiURL.slice(0, -4) + response.avatar;

                        // Fetch avatar, decode it as base64 and assign it
                        return fetch(avatarURL, options)
                            .then(res => res.arrayBuffer())
                            .then(buffer => {
                                // https://stackoverflow.com/questions/9267899
                                response.avatar = [];
                                response.avatar[0] = {};
                                response.avatar[0].src =
                                    'data:image/png;base64,' +
                                    btoa(
                                        String.fromCharCode(
                                            ...new Uint8Array(buffer)
                                        )
                                    );
                                return { data: response };
                            });
                    }
                    return { data: response };
                default:
                    return { data: response };
            }
        });
};
