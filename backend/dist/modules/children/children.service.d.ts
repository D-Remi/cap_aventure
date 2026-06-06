import { Repository } from 'typeorm';
import { Child } from './child.entity';
import { User } from '../users/user.entity';
export declare class ChildrenService {
    private repo;
    constructor(repo: Repository<Child>);
    findByUser(uid: number): Promise<Child[]>;
    findAll(): Promise<Child[]>;
    findOne(id: number): Promise<Child>;
    create(user: User, dto: Partial<Child>): Promise<Child>;
    updateStep1(id: number, user: User, dto: any): Promise<Child>;
    updateStep2(id: number, user: User, dto: any): Promise<Child>;
    updateNotesAnimateur(id: number, notes: string): Promise<Child>;
    remove(id: number, user: User): Promise<import("typeorm").DeleteResult>;
}
