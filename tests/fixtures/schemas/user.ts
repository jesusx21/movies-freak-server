import {
  DATETIME,
  EMAIL,
  JSON,
  REGEX,
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
    password: JSON(
      {
        salt: REGEX('d{10}\\/\\d{6}(-\\d)?|(ch|co|ev|nm|tt)\\d{10}'),
        hash: REGEX('d{10}\\/\\d{6}(-\\d)?|(ch|co|ev|nm|tt)\\d{10}')
      },
      ['salt', 'hash']
    ),
    birthdate: DATETIME,
    createdAt: DATETIME,
    updatedAt: DATETIME
  },
  ['id', 'name', 'lastName', 'username', 'email', 'password']
);

export default user;
