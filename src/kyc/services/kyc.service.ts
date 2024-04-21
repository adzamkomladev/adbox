import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { MikroORM, EntityManager, wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import { AttemptType } from '../enums/attempt.type.enum';
import { Status } from '../../@common/enums/status.enum';

import { Kyc } from '../entities/kyc.entity';
import { Identity } from '../entities/identity.entity';
import { Business } from '../entities/business.entity';
import { Attempt } from '../entities/attempt.entity';

import { CreateProfile } from '../dto/create.profile.dto';
import { CreateIdentity } from '../dto/create.identity.dto';
import { CreateBusiness } from '../dto/create.business.dto';
import { QueryDto } from '../dto/query.dto';
import { UpdateStatus } from '../dto/update.status.dto';

import { UsersService } from '../../users/services/users.service';

@Injectable()
export class KycService {
    private readonly logger = new Logger(KycService.name);

    constructor(
        private readonly orm: MikroORM,
        private readonly em: EntityManager,
        @InjectRepository(Kyc)
        private readonly kycRepository: EntityRepository<Kyc>,
        private readonly usersService: UsersService
    ) { }

    async createProfile(id: string, payload: CreateProfile) {
        try {
            const user = await this.usersService.setProfile(id, payload);

            const kyc = this.kycRepository.create({
                level: 1,
                user,
                country: 'GH',
            });
            await this.em.persistAndFlush(kyc);

            return user;
        } catch (e) {
            this.logger.error(`Failed to create profile for user ${id}`, e);
            throw new BadRequestException('Failed to create profile');
        }
    }

    async createIdentity(id: string, { type, front, back, combined }: CreateIdentity) {
        const kyc = await this.findKycByUser(id);

        const identity = new Identity();
        identity.type = type;
        identity.front = front;
        identity.back = back;
        identity.combined = combined;

        kyc.attempts.add(
            this.em.create(
                Attempt, {
                identity,
                status: Status.PENDING,
            })
        );

        await this.em.persistAndFlush(kyc);

        return kyc;
    }

    async createBusiness(id: string, payload: CreateBusiness) {
        const kyc = await this.findKycByUser(id, false);

        const business = new Business();
        business.type = payload.type;
        business.category = payload.category;
        business.url = payload.url;
        business.taxNumber = payload.taxNumber;

        kyc.attempts.add(
            this.em.create(
                Attempt, {
                business,
                status: Status.PENDING,
            })
        );
        await this.em.persistAndFlush(kyc);

        return kyc;
    }

    async updateStatus(id: string, updatedBy: string, { type, status, reason }: UpdateStatus): Promise<Kyc> {
        const [kyc, user] = await Promise.all([
            this.findKycWithAttemptsById(id, type),
            this.usersService.findOne(updatedBy)
        ]);

        if (status !== Status.APPROVED) {
            type === AttemptType.IDENTITY ?
                kyc.identity = null :
                kyc.business = null;
        }

        kyc.attempts[0].status = status;
        kyc.attempts[0].reason = reason;
        kyc.attempts[0].updatedBy = user;

        await this.em.persistAndFlush(kyc);

        return kyc;
    }

    async findAllKyc({ page = 1, size = 10 }: QueryDto) {
        const [kycs, total] = await this.kycRepository.findAndCount(
            {
                user: {
                    role: {
                        code: { $in: ['SUBSCRIBER', 'PUBLISHER'] },
                    }
                },
                attempts: {
                    status: Status.PENDING
                }
            },
            {
                populate: ['user', 'user.role', 'attempts'],
                limit: size,
                offset: (page - 1) * size
            })

        return {
            kycs,
            total,
            page: +page,
            size: +size,
            totalPages: Math.ceil(total / size)
        }
    }

    private async findKycWithAttemptsById(id: string, type: AttemptType) {
        const condition = type === AttemptType.IDENTITY ? { $not: { identity: null } } : { $not: { business: null } };

        const kyc = await this.kycRepository.findOneOrFail(
            id,
            {
                populate: ['attempts'],
                populateWhere: {
                    attempts: {
                        status: Status.PENDING,
                        ...condition
                    }
                }
            }
        );

        const noPendingAttempt = kyc.attempts.length === 0;

        if (noPendingAttempt) {
            throw new BadRequestException('No pending attempt to be approved/rejected!');
        }

        return kyc;
    }

    private async findKycByUser(id: string, isIdentity: boolean = true) {
        const condition = isIdentity ? { $not: { identity: null } } : { $not: { business: null } };

        const kyc = await this.kycRepository.findOneOrFail({
            user: {
                id
            }
        }, {
            populate: ['attempts'],
            populateWhere: {
                attempts: {
                    status: Status.PENDING,
                    ...condition
                }
            }
        });

        const pendingAttemptExists = kyc.attempts.length > 0;

        if (pendingAttemptExists) {
            throw new BadRequestException('Kindly wait for approval/rejection before attempting again');
        }

        return kyc;
    }
}