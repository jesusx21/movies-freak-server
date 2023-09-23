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
    username: REGEX('^(?=.{8,20}$)(?![_])[a-zA-Z0-9_]+(?<![_])$'),
    lastName: STRING({ min: 5, max: 20 }),
    email: EMAIL,
    password: JSON(
      {
        salt: REGEX('^(?=.{8,20}$)[a-zA-Z0-9]$'),
        hash: REGEX('^(?=.{8,20}$)[a-zA-Z0-9]$')
      }
    ),
    birthdate: DATETIME,
    createdAt: DATETIME,
    updatedAt: DATETIME
  }
);

export default user;
