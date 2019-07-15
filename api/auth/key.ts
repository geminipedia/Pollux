import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import { UserSignPayload, UserKeyOptions } from '../types';
import log from '../util/log';

const publicKey = fs.readFileSync(path.resolve(__dirname, '../../', process.env.PUBLIC_KEY));
const privateKey = fs.readFileSync(path.resolve(__dirname, '../../', process.env.PRIVATE_KEY));

const sign = async (payload: UserSignPayload, options: UserKeyOptions = {}): Promise<string> => {
  return await jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: options.remember || false ? '30d' : '1d' });
};

const verify = async (token: string, req: Request): Promise<UserSignPayload> => new Promise((resolve, reject) => {
  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, async (error, payload: UserSignPayload) => {
    if (error) {
      // Write Log
      await log.error({
        ip: req.ip,
        result: `Token ${token} authorization failed.\n\nError: ${error}`
      });
      reject(new Error('#ERR_U00F'));
    }

    resolve(payload);
  });
});

export {
  sign,
  verify
};
