import { UUID } from '../common';

export type Password = {
  hash?: string,
  salt?: string
};

export default interface UserEntity {
  id?: UUID;
  name: string;
  username: string;
  lastName?: string;
  email: string;
  birthdate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
