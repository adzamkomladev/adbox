import { User } from '../entities/user.entity';

export class UserCreatedEvent {
  user: User;
}
