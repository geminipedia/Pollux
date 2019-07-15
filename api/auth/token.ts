import { Request, Response } from 'express';
import { prisma, User } from '../model';
import { UserSignPayload } from '../types';
import auth from '.';

const token = {
  set: (res: Response, cookie: string): void => {
    res.header('Access-Control-Allow-Origin', 'https://mslib.tw');
    res.cookie('__TOKEN', cookie,
      {
        domain: '.mslib.tw',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: false,
        secure: true
      }
    );
  },

  get: (req: Request): string => {
    return req.get('Authorization').split('Bearer ')[1];
  },

  parse: async (req: Request): Promise<User> => {
    const userInfo: UserSignPayload = await auth.verify(token.get(req), req);
    return await prisma.user({ id: userInfo.id });
  }
};

export default token;
