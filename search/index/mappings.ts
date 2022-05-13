import { MessengerIndex } from './types';
import { genericDatatype, keywordType, textType } from './data-type';

export const messengerProperties: {
  [prop in keyof MessengerIndex]: genericDatatype;
} = {
  id: keywordType,
  content: textType,
  timeout: textType,
};
