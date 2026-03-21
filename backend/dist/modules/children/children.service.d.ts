import { Repository } from 'typeorm';
import { Child } from './child.entity';
import { User } from '../users/user.entity';
export declare class ChildrenService {
    private repo;
    constructor(repo: Repository<Child>);
    findByUser(userId: number): Promise<Child[]>;
    findAll(): Promise<Child[]>;
    create(user: User, dto: Partial<Child>): Promise<Child>;
    remove(id: number, user: User): Promise<Child>;
}
