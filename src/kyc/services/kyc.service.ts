import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@mikro-orm/nestjs';
import { MikroORM, EntityManager, wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';

import { AttemptType } from '../enums/attempt.type.enum';
import { Status } from '../../@common/enums/status.enum';

import { Kyc } from '../../@common/db/entities/kyc/kyc.entity';
import { Identity } from '../../@common/db/entities/kyc/identity.entity';
import { Business } from '../../@common/db/entities/kyc/business.entity';
import { Attempt } from '../../@common/db/entities/kyc/attempt.entity';

import { CreateProfile } from '../dto/create.profile.dto';
import { CreateIdentity } from '../dto/create.identity.dto';
import { CreateBusiness } from '../dto/create.business.dto';
import { QueryDto } from '../dto/query.dto';
import { UpdateStatus } from '../dto/update.status.dto';

import { UserRepository } from '../../@common/db/repositories';

@Injectable()
export class KycService {
    private readonly logger = new Logger(KycService.name);

    constructor(
        private readonly orm: MikroORM,
        private readonly em: EntityManager,
        private readonly userRepository: UserRepository
    ) { }

    async createProfile(id: string, payload: CreateProfile) {
        try {
            const user = await this.userRepository.saveProfile(id, payload);

            if (!user) throw new BadRequestException('failed to set profile');

            return user;
        } catch (e) {
            this.logger.error(`Failed to create profile for user ${id}`, e);
            throw new BadRequestException('Failed to create profile');
        }
    }

    async createIdentity(id: string, { type, front, back, combined }: CreateIdentity) {
        const kyc = await this.findKycByUser(id);

        const details = new Identity();
        details.front = front;
        details.back = back;
        details.combined = combined;
        details.idType = type;

        kyc.attempts.add(
            this.em.create(
                Attempt, {
                    details,
                    level: 2,
                status: Status.PENDING,
            })
        );

        await this.em.persistAndFlush(kyc);

        return kyc;
    }

    async createBusiness(id: string, payload: CreateBusiness) {
        const kyc = await this.findKycByUser(id, false);

        const details = new Business();
        details.category = payload.category;
        details.url = payload.url;
        details.taxNumber = payload.taxNumber;
        details.docType = payload.type;

        kyc.attempts.add(
            this.em.create(
                Attempt, {
                    details,
                    level: 4,
                status: Status.PENDING,
            })
        );
        await this.em.persistAndFlush(kyc);

        return kyc;
    }

    async updateStatus(id: string, updatedBy: string, { type, status, reason }: UpdateStatus): Promise<Kyc> {
        const [kyc, user] = await Promise.all([
            this.findKycWithAttemptsById(id, type === AttemptType.IDENTITY ? 2 : 4),
            this.userRepository.findOneById(updatedBy)
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
        const [kycs, total] = await this.em.findAndCount(
            Kyc,
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
            });

        return {
            kycs,
            total,
            page: +page,
            size: +size,
            totalPages: Math.ceil(total / size)
        }
    }

    private async findKycWithAttemptsById(id: string, level: number) {
        const kyc = await this.em.findOneOrFail(
            Kyc,
            id,
            {
                populate: ['attempts'],
                populateWhere: {
                    attempts: {
                        status: Status.PENDING,
                        level,
                        $not: { details: null }
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
        const kyc = await this.em.findOneOrFail(
            Kyc,
            { user: { id } },
            {
                populate: ['attempts'],
                populateWhere: {
                    attempts: {
                        status: Status.PENDING,
                        level: isIdentity ? 2 : 4,
                        $not: { details: null }
                    }
                }
            }
        );

        const pendingAttemptExists = kyc.attempts.length > 0;

        if (pendingAttemptExists) {
            throw new BadRequestException('Kindly wait for approval/rejection before attempting again');
        }

        return kyc;
    }
}
