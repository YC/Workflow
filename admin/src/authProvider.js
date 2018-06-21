// Handles authentication
// Sourced from:
// https://github.com/marmelab/react-admin/tree/master/examples/tutorial/src
// Licensed under MIT

import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR } from 'react-admin';
import { apiURL } from './dataProvider';

export default (type, params) => {
    // Called when the user attempts to log in
    if (type === AUTH_LOGIN) {
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
    }

    // Called when the user clicks on the logout button
    if (type === AUTH_LOGOUT) {
        // Define logout request
        const request = new Request(apiURL + '/user/logout', {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json' })
        });

        // Execute request
        return fetch(request, { credentials: 'include' }).then(() => {
            return Promise.resolve();
        });
    }

    // Called when the API returns an error
    if (type === AUTH_ERROR) {
        return Promise.reject();
    }

    // Resolve all valid requests
    return Promise.resolve();
};
