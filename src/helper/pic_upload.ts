import mongoose from 'mongoose';
import multer from 'multer';
import { Request } from 'express';

// Location of upload directory relative to root of server
const uploadDirectoryFromRoot = '/uploads/pictures/';
export { uploadDirectoryFromRoot };
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

// Limits of upload (12 file @ 3MB)
const limits = {
    files: 12,
    fileSize: 3 * 1024 * 1024
};

// Filter for file type
const fileFilter = (req: Request, file: any, callback: any) => {
    // Supported mimetypes
    const mimes = ['image/jpeg', 'image/png', 'image/gif'];

    // Check mimetype
    if (mimes.includes(file.mimetype)) {
        callback(undefined, true);
    } else {
        const err = new Error('Invalid file type');
        err.status = 400;
        callback(err, undefined);
    }
};

// Defines Multer upload middleware
const upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
});

export default upload;
