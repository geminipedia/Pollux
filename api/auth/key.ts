import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { UserSignPayload, UserKeyOptions } from '../types';

const publicKey = fs.readFileSync(path.resolve(__dirname, '../../', process.env.PUBLIC_KEY));
const privateKey = fs.readFileSync(path.resolve(__dirname, '../../', process.env.PRIVATE_KEY));

const sign = async (payload: UserSignPayload, options?: UserKeyOptions): Promise<string> => {
  return await jwt.sign(payload, publicKey, { algorithm: 'ES512', expiresIn: options.remember ? '30d' : '1d' });
};

const verify = async (token: string): Promise<string | object> => {
  return await jwt.verify(token, privateKey, { algorithms: ['ES512'] });
};

export {
  sign,
  verify
};
