import { User } from '../../@common/db/entities/users/user.entity';

export class UserCreatedEvent {
  user: User;
}
