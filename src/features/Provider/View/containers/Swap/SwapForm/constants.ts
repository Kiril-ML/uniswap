const initialState = {
  firstToken: {
    address: '',
    name: '',
    symbol: '',
    value: '',
    userBalance: '',
    pairBalance: '0',
    decimals: 0,
    image: '',
  },
  secondToken: {
    address: '',
    name: '',
    symbol: '',
    value: '',
    userBalance: '',
    pairBalance: '0',
    decimals: 0,
    image: '',
  },
  slippage: 0.5,
};

const MAX_SLIPPAGE = 50;
const MIN_SLIPPAGE = 0;

export { initialState, MAX_SLIPPAGE, MIN_SLIPPAGE };
