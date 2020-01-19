// Handles authentication
// Sourced from:
// https://github.com/marmelab/react-admin/tree/master/examples/tutorial/src
// Licensed under MIT

import { apiURL } from './dataProvider';

const authProvider = {
    login: params => {
        // Extract username/password
        const { username, password } = params;
        // Define login request
        const request = new Request(apiURL + '/user/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' })
        });

        // Execute request
        return fetch(request, { credentials: 'include' })
            .then(response => {
                // If response is of status code 401, authentication has failed
                if (response.status === 401) {
                    return Promise.reject();
                }
                // If response is invalid, throw error
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                // Return response for next promise
                return response.json();
            })
            .then(res => {
                // Reject if user is not admin
                if (!res.scope.includes('admin')) {
                    return Promise.reject();
                }
            });
    },
    logout: params => {
        // Define logout request
        const request = new Request(apiURL + '/user/logout', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' })
        });

        // Execute request
        return fetch(request, { credentials: 'include' }).then(() => {
            return Promise.resolve();
        });
    },
    checkError: params => {
        return Promise.resolve();
    },
    checkAuth: params => {
        // Define logout request
        const request = new Request(apiURL + '/user/session', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' })
        });
        return fetch(request, { credentials: 'include' }).then(res => {
            if (res.status === 200) {
                return Promise.resolve();
            } else {
                return Promise.reject();
            }
        });
    },
    getPermissions: params => Promise.resolve()
};
export default authProvider;
