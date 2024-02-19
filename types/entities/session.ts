import { User } from '../../app/moviesFreak/entities';
import { UUID } from '../common';

export default interface SessionEntity {
  id?: UUID;
  user: User;
  token?: string;
  expiresAt?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
