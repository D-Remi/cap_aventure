import { Response } from 'express';
import { User } from '../users/user.entity';
export declare class UploadController {
    uploadActivityImage(file: Express.Multer.File): {
        filename: string;
        url: string;
    };
    serveActivityImage(filename: string, res: Response): void;
    uploadDocument(file: Express.Multer.File, user: User): {
        filename: string;
        originalName: string;
        size: number;
        url: string;
        uploadedBy: number;
    };
    serveDocument(filename: string, user: User, res: Response): void;
    deleteActivityImage(filename: string): {
        deleted: boolean;
    };
    deleteDocument(filename: string): {
        deleted: boolean;
    };
}
