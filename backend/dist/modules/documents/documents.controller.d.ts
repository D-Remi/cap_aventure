import { DocumentsService } from './documents.service';
import { User } from '../users/user.entity';
export declare class DocumentsController {
    private service;
    constructor(service: DocumentsService);
    findMine(user: User): Promise<import("./document.entity").Document[]>;
    findByChild(childId: string, user: User): Promise<import("./document.entity").Document[]>;
    upload(file: Express.Multer.File, user: User, childId: string, type: string): Promise<import("./document.entity").Document>;
    remove(id: string, user: User): Promise<import("./document.entity").Document>;
}
