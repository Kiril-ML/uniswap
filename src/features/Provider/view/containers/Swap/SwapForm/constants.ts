const initialState = {
  firstToken: {
    address: '',
    name: '',
    symbol: '',
    userBalance: '',
    decimals: 18,
    image: '',
  },
  secondToken: {
    address: '',
    name: '',
    symbol: '',
    userBalance: '',
    decimals: 18,
    image: '',
  },
  slippage: 2,
};

const MAX_SLIPPAGE = 50;
const MIN_SLIPPAGE = 0;

export { initialState, MAX_SLIPPAGE, MIN_SLIPPAGE };
