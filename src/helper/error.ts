/**
 * Error type with status
 * https://stackoverflow.com/questions/41102060
 */
class ErrorStatus extends Error {
    status: number;

    constructor(message?: string, status?: number) {
        super(message);
        this.status = status;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ErrorStatus.prototype);
    }
}

export default ErrorStatus;
