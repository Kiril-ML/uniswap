import { State } from '../types';

const initialState: State = {
  status: 'idle',
  isCalculatingAmountIn: false,
  isCalculatingAmountOut: false,
  isCalculatingMaxAmountOutValue: false,
  error: null,
  data: {
    tokens: [],
    pairs: [],
    fee: { value: '0', decimals: 0 },
  },
  calculatedAmountInValue: {
    amountIn: '',
    tokenInFee: '',
    decimals: 18,
  },
  calculatedAmountOutValue: {
    amountOut: '',
    tokenOutFee: '0',
    decimals: 18,
  },
  calculatedMaxAmountOutValue: {
    amountOut: '',
    decimals: 18,
  },
};

export { initialState };
