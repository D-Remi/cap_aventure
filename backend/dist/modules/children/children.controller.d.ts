import { ChildrenService } from './children.service';
import { User } from '../users/user.entity';
export declare class ChildrenController {
    private svc;
    constructor(svc: ChildrenService);
    getAll(u: User): Promise<import("./child.entity").Child[]>;
    getOne(id: string): Promise<import("./child.entity").Child>;
    create(u: User, dto: any): Promise<import("./child.entity").Child>;
    step1(id: string, u: User, dto: any): Promise<import("./child.entity").Child>;
    step2(id: string, u: User, dto: any): Promise<import("./child.entity").Child>;
    notes(id: string, notes: string): Promise<import("./child.entity").Child>;
    remove(id: string, u: User): Promise<import("typeorm").DeleteResult>;
}
