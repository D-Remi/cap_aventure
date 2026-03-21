import { InterestService } from './interest.service';
import { CreateInterestDto } from '../../common/dto';
export declare class InterestController {
    private service;
    constructor(service: InterestService);
    create(dto: CreateInterestDto): Promise<import("./interest.entity").InterestForm>;
    findAll(): Promise<import("./interest.entity").InterestForm[]>;
}
