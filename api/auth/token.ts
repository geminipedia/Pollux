import { Request, Response } from 'express';

const token = {
  set: (res: Response, cookie: string): void => {
    res.header('Access-Control-Allow-Origin', 'https://mslib.tw');
    res.cookie('__TOKEN', cookie,
      {
        domain: '.mslib.tw',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly: false,
        secure: true
      }
    );
  },

  get: (req: Request): string => {
    return req.get('Authorization').split('Bearer ')[1];
  }
};

export default token;
