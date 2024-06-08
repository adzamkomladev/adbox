import { Injectable, Logger } from '@nestjs/common';

import { EntityManager, wrap } from '@mikro-orm/postgresql';

import { Kyc, Role, User } from '../../entities';
import { Status } from '../../../enums/status.enum';

@Injectable()
export class UserRepository {
    private readonly logger = new Logger(UserRepository.name);

    constructor(private readonly em: EntityManager) { }

    async findOneByEmail(email: string) {
        return await this.em.findOne(
            User,
            { email },
            {
                populate: ['wallet', 'role', 'kyc', 'kyc.attempts'],
                populateOrderBy: {
                    kyc: {
                        attempts: {
                            createdAt: 'DESC'
                        }
                    }
                }
            }
        );
    }

    async findOneById(id: string) {
        return await this.em.findOne(
            User,
            { id },
            {
                populate: ['wallet', 'role', 'kyc', 'kyc.attempts'],
                populateOrderBy: {
                    kyc: {
                        attempts: {
                            createdAt: 'DESC'
                        }
                    }
                }
            }
        );
    }

    async findOneByFirstName(firstName: string) {
        return await this.em.findOne(
            User,
            { firstName }
        );
    }

    async findOneByCredentials(email: string, password: string) {
        const user = await this.em.findOne(User, { email });

        if (!user) return null;

        const isValid = await user.validatePassword(password);

        return isValid ? user : null;
    }

    async setUserRole(id: string, code: string): Promise<{ user: User, role: Role }> {
        const [user, foundRole] = await Promise.all([
            this.em.findOne(User, id),
            this.em.findOne(Role, { code })
        ]);

        if (!user || !foundRole) return null;

        wrap(user).assign({ role: foundRole });
        await this.em.persistAndFlush(user);

        return { user, role: foundRole }
    }

    async savePhone(id: string, phone: string) {
        const user = await this.em.findOne(User, id);

        if (!user) return null;

        wrap(user).assign({ phone, phoneVerifiedAt: null });
        await this.em.persistAndFlush(user);

        return user;
    }

    async saveProfile(id: string, { avatar, dateOfBirth, firstName, lastName, sex }: any) {
        const user = await this.em.findOne(User, id, { populate: ['kyc'] });

        if (!user) return null;

        wrap(user).assign({
            firstName,
            lastName,
            sex,
            avatar: avatar || user?.avatar,
            dateOfBirth,
            status: Status.ACTIVE
        });

        if (!user.kyc) {
            user.kyc = this.em.create(Kyc, {
                level: 1,
                country: 'GH',
            });
        }

        await this.em.persistAndFlush(user);

        return user;
    }

    async saveExtraProfileDetails(id: string, { dateOfBirth, country }: any) {
        const user = await this.em.findOne(User, id);

        if (!user) return null;

        wrap(user).assign({ dateOfBirth, status: Status.ACTIVE });
        await this.em.persistAndFlush(user);

        return user;
    }
    async saveExternalAuthUser({ firebaseId, avatar, email, firstName, lastName, walletBalance, }: any) {
        let user = await this.em.findOne(User, { firebaseId });

        if (user) {
            wrap(user).assign({ avatar, email, firstName, lastName });
        } else {
            user = this.em.create(User, { firebaseId, avatar, email, firstName, lastName, });
        }

        await this.em.persistAndFlush(user);

        return user;
    }

    async markPhoneAsVerified(id: string) {
        const user = await this.em.findOne(User, id);

        if (!user) return null;

        wrap(user).assign({ phoneVerifiedAt: new Date() });
        await this.em.persistAndFlush(user);

        return user;
    }

    async createSubscriber(data: any) {
        const role = await this.em.findOne(Role, { code: 'SUBSCRIBER' });

        const user = this.em.create(User, {
            ...data,
            role
        });
        await this.em.persistAndFlush(user);

        await this.em.populate(user, ['wallet']);

        return user;
    }

    async createAdmin({ roleId, roleTitle, email, status, firstName, lastName }: any) {
        const role = await this.em.findOneOrFail(Role, roleId);

        const user = this.em.create(User, {
            firstName,
            lastName,
            email,
            roleTitle,
            status: status || Status.ACTIVE,
            avatar: `https://ui-avatars.com/api/?name=${firstName} ${lastName}`,
            password: 'Abcde12345!',
            role
        });
        await this.em.persistAndFlush(user);

        await this.em.populate(user, ['role']);

        return user;
    }

    async findAllAdminsPaginated(page: number, size: number) {
        const [users, total] = await this.em.findAndCount(
            User,
            {
                role: {
                    code: { $in: ['ADMIN', 'SUPER_ADMIN'] },
                }
            },
            {
                populate: ['role'],
                limit: size,
                offset: (page - 1) * size
            })

        return {
            users,
            total,
            page: +page,
            size: +size,
            totalPages: Math.ceil(total / size)
        }
    }
}
