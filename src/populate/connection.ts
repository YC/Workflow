import { SERVER_URL } from './index';
const fetch = require('fetch-cookie')(require('node-fetch'));

// Handles GET requests
async function getData(url: string): Promise<any> {
    // Send request
    return fetch(SERVER_URL + url, {
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/json'
        },
        method: 'GET',
        mode: 'cors'
    }).then((response: any) => {
        // Process response
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    });
}

// Handles POST requests
// Adapted from https://stackoverflow.com/questions/41103360
async function sendData(
    url: string,
    data: any = {},
    method: any = 'POST'
): Promise<any> {
    // Send request
    return fetch(SERVER_URL + url, {
        body: JSON.stringify(data),
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/json'
        },
        method: method,
        mode: 'cors'
    }).then((response: any) => {
        // Process response
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    });
}

// Handles avatar sending
async function putAvatar(url: string, data: any): Promise<any> {
    // Send request
    return fetch(SERVER_URL + url, {
        body: data,
        credentials: 'same-origin',
        method: 'PUT',
        mode: 'cors'
    }).then((response: any) => {
        // Process response
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response.json();
    });
}

export { getData, sendData, putAvatar };
