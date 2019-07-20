import { Request, Response } from 'express';
import * as dotenv from 'dotenv';

import { prisma, User } from '../model';
import { UserSignPayload } from '../types';
import auth from '.';

dotenv.config();

const token = {
  set: (res: Response, cookie: string): void => {
    res.header('Access-Control-Allow-Origin', `https://${process.env.SITE_DOMAIN}`);
    res.cookie('__TOKEN', cookie,
      {
        domain: `.${process.env.SITE_DOMAIN}`,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
        secure: true
      }
    );
  },

  get: (req: Request): string => {
    return  req.cookies.__TOKEN || req.get('Authorization').split('Bearer ')[1];
  },

  parse: async (req: Request): Promise<User> => {
    const userInfo: UserSignPayload = await auth.verify(token.get(req), req);
    return await prisma.user({ id: userInfo.id });
  }
};

export default token;
