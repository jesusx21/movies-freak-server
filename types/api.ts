import Presenters from '../api/v1/presenters';
import { Database } from './database';
import { IMDBGateway } from './app';
import { Json, UUID } from './common';

export type APIError = {
  code: string,
  error?: Json
};

export type Titles = {
  database: Database;
  imdb: IMDBGateway;
  presenters: Presenters
};

export type Session = {
  id: UUID,
  token: string,
  expiresAt: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  user: {
    id: UUID,
    name: string
  }
};

export type User = {
  id: UUID;
  name: string;
  username: string;
  lastName?: string;
  email: string;
  birthdate?: Date;
  createdAt: Date;
  updatedAt: Date;
};

