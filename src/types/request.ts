// Extend Express request type with additional properties
// (which are set by custom middleware)
declare namespace Express {
    interface Request {
        team?: any;
        filter?: any;
        options?: any;
    }
}
