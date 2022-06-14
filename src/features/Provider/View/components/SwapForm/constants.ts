const initialState = {
  optionValues: [null, null],
  firstTokenValue: {
    address: '',
    name: '',
    symbol: '',
    value: '',
    userBalance: '0',
    pairBalance: '0',
    decimals: 0,
    image: '',
  },
  secondTokenValue: {
    address: '',
    name: '',
    symbol: '',
    value: '',
    userBalance: '0',
    pairBalance: '0',
    decimals: 0,
    image: '',
  },
  tokensMax: ['0', '0'],
  proportion: { pairAddress: '', value: '', decimals: 0 },
  slippage: 10,
};

export { initialState };
