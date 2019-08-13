import { Event } from '../../model';

const eventCodeToEventSourcePrefix = {
  A: 'Admin',
  B: 'Site',
  C: 'Page',
  D: 'Theme',
  E: 'Entity',
  F: '', // General event, no prefix.
  G: 'Group',
  H: 'File',
  I: 'Item',
  J: 'Image',
  K: 'i18n',
  L: 'Log',
  M: 'Post',
  N: 'News',
  O: 'Note',
  P: 'Property',
  Q: 'Quote',
  R: 'Reply',
  S: 'Statement',
  T: 'Tag',
  U: 'User',
  X: 'Lang'
};

const eventCodeToEventDescription = {
  '000': 'already existed.',
  '001': 'does not exist.',
  '00F': 'authorization failed.',
  '0FF': 'invalid token.',
  'F00': 'permission deny.',
  'FFF': 'unexpected error.'
};

export interface FetchMessagePayload {
  code: Event['code'];
  result: Event['result'];
}

const firstLetterUppercase = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const fetchMsg = (code: string, customResult?: string): FetchMessagePayload => {
  const args = code.match(/(#ERR_)([A-Z])([\dA-Z]{3})/);

  if (!args) {
    throw new Error('Syntax error: error code does not match.');
  }

  return {
    code,
    result: firstLetterUppercase(`${eventCodeToEventSourcePrefix[args[2]]} ${customResult ? customResult + ' ' : ''}${eventCodeToEventDescription[args[3]]}`.trim())
  };
};

export default fetchMsg;
