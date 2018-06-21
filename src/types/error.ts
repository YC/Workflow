// Defines/extends Error types
// Adapted from https://stackoverflow.com/questions/28793098

// Extend Error with status (200/300/400 etc.)
interface Error {
    status?: number;
}

// Define ErrorResponse type
interface ErrorResponse {
    message?: string;
    stack?: string;
}
