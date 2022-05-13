export const keywordType = {
  type: 'keyword',
};
export const textType = {
  type: 'text',
};
export type genericDatatype = typeof keywordType | typeof textType;
