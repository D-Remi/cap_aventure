import { DocumentsService } from './documents.service';
import { User } from '../users/user.entity';
export declare class DocumentsController {
    private svc;
    constructor(svc: DocumentsService);
    findMine(user: User): Promise<import("./document.entity").Document[]>;
    getData(id: string): Promise<import("./document.entity").Document>;
    upload(user: User, body: {
        child_id?: number;
        type: string;
        filename: string;
        nom: string;
        mimetype: string;
        taille: number;
        data: string;
    }): Promise<any>;
    validate(id: string, valide: boolean, note: string): Promise<import("./document.entity").Document>;
    remove(id: string, user: User): Promise<import("typeorm").DeleteResult>;
}
