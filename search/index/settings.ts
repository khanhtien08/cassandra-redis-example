export const messengerSettings = {
  analysis: {
    filter: {
      my_ascii_folding: {
        type: 'asciifolding',
        preserve_original: true,
      },
    },
    analyzer: {
      my_folding: {
        type: 'custom',
        filter: ['lowercase', 'my_ascii_folding'],
        tokenizer: 'standard',
      },
    },
  },
}