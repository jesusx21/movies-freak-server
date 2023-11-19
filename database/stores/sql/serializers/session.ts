import Serializer, { field } from '../serializer';
import { Session } from '../../../../app/moviesFreak/entities';

const SessionSerializer = Serializer
  .init<Session>(Session)
  .addSchema(
    field('id'),
    field('token'),
    field('expires_at', { from: 'expiresAt' }),
    field('is_active', { from: 'isActive' }),
    field('created_at', { from: 'createdAt' }),
    field('updated_at', { from: 'updatedAt' })
  );

export default SessionSerializer;
