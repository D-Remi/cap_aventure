import { UsersService } from './users.service';
import { User } from './user.entity';
export declare class UsersController {
    private service;
    constructor(service: UsersService);
    me(user: User): User;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, dto: Partial<User>): Promise<User>;
    remove(id: string): Promise<User>;
}
