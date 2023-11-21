import {
  BOOLEAN,
  DATETIME,
  JSON,
  REGEX,
  UUID
} from '../types';
import user from './user';

const session = JSON(
  {
    id: UUID,
    token: REGEX('d{10}\\/\\d{6}(-\\d)?|(ch|co|ev|nm|tt)\\d{10}'),
    expiresAt: DATETIME,
    isActive: BOOLEAN,
    createAt: DATETIME,
    updatedAt: DATETIME,

    user
  },
  ['token', 'expiresAt', 'isActive', 'user']
);

export default session;
