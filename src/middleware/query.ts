import { Request, Response, NextFunction } from 'express';
import isMongoId from 'validator/lib/isMongoId';

// Parses req.query and transforms them into parameters used by
// mongoose/mongo queries
export let parseQuery = (req: Request, res: Response, next: NextFunction) => {
    // Define objects for mongoose query parameters
    const filter: any = {};
    const options: any = {};

    // Set limit and offset (if applicable)
    if (req.query.limit && req.query.offset) {
        options.limit = Number(req.query.limit);
        options.skip = Number(req.query.offset);
    }
    if (req.query.sort) {
        options.sort = req.query.sort;
    }

    // Parse each query parameter
    for (const queryName of Object.keys(req.query)) {
        // Ignore already parsed parameters
        if (
            queryName === 'limit' ||
            queryName === 'offset' ||
            queryName === 'sort'
        ) {
            continue;
        }

        // If querying for multiple ids
        if (queryName === 'ids') {
            filter['_id'] = req.query[queryName].split(',');

            // Check ids
            for (const id of filter['_id']) {
                if (!isMongoId(id)) {
                    const err = new Error('Requested ids are not valid');
                    err.status = 400;
                    return next(err);
                }
            }
            continue;
        }

        // Get the query value
        const queryValue = req.query[queryName];
        if (queryName.includes(',')) {
            // If the value is an array
            filter[queryName] = queryValue.split(',');
        } else {
            // If value is just a value
            filter[queryName] = queryValue;
        }
    }

    // Set mongoose query parameters
    req.filter = filter;
    req.options = options;
    next();
};
