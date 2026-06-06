import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { User } from '../users/user.entity';
export declare class DocumentsService {
    private repo;
    constructor(repo: Repository<Document>);
    findByUser(userId: number): Promise<Document[]>;
    findAll(): Promise<Document[]>;
    findOneWithData(id: number): Promise<Document>;
    create(user: User, dto: {
        child_id?: number;
        type: string;
        filename: string;
        nom: string;
        mimetype: string;
        taille: number;
        data: string;
    }): Promise<any>;
    validate(id: number, valide: boolean, note?: string): Promise<Document>;
    remove(id: number, user: User): Promise<import("typeorm").DeleteResult>;
}
