// Warn if API URL is not set
if (!process.env.REACT_APP_API_URL) {
    console.error('Warning: API URL not set');
}
// Set API URL to value of REACT_APP_API_URL environment variable
const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// The Server URL is the API URL without the '/api' portion
const serverURL = apiURL.slice(0, -4);
export { apiURL, serverURL };
