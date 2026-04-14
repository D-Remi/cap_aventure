import { ChildrenService } from './children.service';
import { User } from '../users/user.entity';
export declare class ChildrenController {
    private service;
    constructor(service: ChildrenService);
    getMyChildren(user: User): Promise<import("./child.entity").Child[]>;
    create(user: User, dto: any): Promise<import("./child.entity").Child>;
    update(id: string, user: User, dto: any): Promise<import("./child.entity").Child>;
    remove(id: string, user: User): Promise<import("./child.entity").Child>;
}
