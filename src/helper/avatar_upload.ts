// Helper for handling avatar uploads
// Note: For better efficiency and to use cloud storage, it is probably best
// to write a custom StorageEngine, as described by:
// https://github.com/expressjs/multer/blob/master/StorageEngine.md
// Adapted from:
// https://github.com/expressjs/multer
// http://markocen.github.io/blog/pre-processing-uploaded-image-on-nodejs.html
// https://github.com/expressjs/multer/issues/203

import mongoose from 'mongoose';
import multer from 'multer';
import { Request } from 'express';
import jimp from 'jimp';
import ErrorStatus from './error';

// Location of upload directory relative to root of server
const uploadDirectoryFromRoot = '/uploads/avatars/';

// Storage location/filename
const storage = multer.diskStorage({
    // Destination directory
    destination: __dirname + '/..' + uploadDirectoryFromRoot,
    // Defines filename of saved file
    // Use mongoose as a way to generate a random string
    // Note: for best practices, it is probably best to use generate the
    // filename in some other way
    filename: function(req: Request, file, callback) {
        const filename = new mongoose.mongo.ObjectId();
        callback(
            undefined,
            filename.toString() + '.' + file.originalname.split('.').pop()
        );
    }
});

// Limit upload (1 file @ 3MB)
const limits = {
    files: 1,
    fileSize: 3 * 1024 * 1024
};

// Define filetype filter
const fileFilter = (req: Request, file: any, callback: any) => {
    // Supported mimetypes
    const mimes = ['image/jpeg', 'image/png', 'image/gif'];

    // Check mimetype
    if (mimes.includes(file.mimetype)) {
        callback(undefined, true);
    } else {
        const err = new ErrorStatus('Invalid file type', 400);
        callback(err, undefined);
    }
};

// Define Multer avatar upload middleware
export let avatar = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
});

// Function for processing upload image
export let processAvatar = async function(file: any): Promise<string> {
    // Initialise jimp with buffer
    const image = await jimp.read(file.path);

    // Resize image
    image
        .resize(256, 256)
        .quality(100)
        .write(file.path);

    // Return filename of file on success
    return uploadDirectoryFromRoot + file.filename;
};
