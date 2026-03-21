import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto, UpdateRegistrationStatusDto } from '../../common/dto';
import { User } from '../users/user.entity';
export declare class RegistrationsController {
    private service;
    constructor(service: RegistrationsService);
    mine(user: User): Promise<import("./registration.entity").Registration[]>;
    findAll(): Promise<import("./registration.entity").Registration[]>;
    byActivity(actId: string): Promise<import("./registration.entity").Registration[]>;
    create(user: User, dto: CreateRegistrationDto): Promise<import("./registration.entity").Registration>;
    updateStatus(id: string, dto: UpdateRegistrationStatusDto): Promise<import("./registration.entity").Registration>;
    cancel(id: string, user: User): Promise<import("./registration.entity").Registration>;
}
