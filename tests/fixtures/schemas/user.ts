import {
  DATETIME,
  EMAIL,
  JSON,
  STRING,
  UUID
} from '../types';

const user = JSON(
  {
    id: UUID,
    name: STRING({ min: 5, max: 20 }),
    username: STRING({ min: 3, max: 15 }),
    lastName: STRING({ min: 5, max: 20 }),
    email: EMAIL,
    birthdate: DATETIME,
    createdAt: DATETIME,
    updatedAt: DATETIME
  },
  ['id', 'name', 'lastName', 'username', 'email', 'password']
);

export default user;
