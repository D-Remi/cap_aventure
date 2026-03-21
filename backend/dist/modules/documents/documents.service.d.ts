import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { User } from '../users/user.entity';
export declare class DocumentsService {
    private repo;
    constructor(repo: Repository<Document>);
    findByUser(userId: number): Promise<Document[]>;
    findAll(): Promise<Document[]>;
    findByChild(childId: number): Promise<Document[]>;
    create(user: User, dto: {
        child_id?: number;
        type: string;
        filename: string;
        original_name: string;
        size: number;
        url: string;
    }): Promise<Document>;
    remove(id: number, user: User): Promise<Document>;
}
