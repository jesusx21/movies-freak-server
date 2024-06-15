import express from 'express';
import MoviesFreakApp from '../../index';
import { HTTPInternalError, HTTPUnauthorized } from '../../httpResponses';
import { NotFound } from '../../../database/stores/errors';
import { Monopoly } from '../../../boardGame';

export default async function authenticate<T extends Monopoly>(
  req: express.Request,
  app: MoviesFreakApp,
  resource: T
) {
  const database = app.getDatabase();
  const { authorization } = req.headers ?? {};

  if (!authorization) {
    throw new HTTPUnauthorized();
  }

  const [tokenType, token] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    throw new HTTPUnauthorized('EXPECTED_BEARER_TOKEN');
  }

  try {
    const session = await database
      .sessions
      .findCurrentSessionByToken(token);

    if (session.isExpired()) throw new HTTPUnauthorized();

    resource.setTitle('session', session);

    if (!!session.user) {
      resource.setTitle('user', session.user);
    }
  } catch(error: any) {
    if (error instanceof NotFound) {
      throw new HTTPUnauthorized();
    }

    // TODO: report error
    throw new HTTPInternalError(error);
  }
}
