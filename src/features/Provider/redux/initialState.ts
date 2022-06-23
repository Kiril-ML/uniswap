import { State } from '../types';

const initialState: State = {
  status: 'idle',
  isCalculatingAmountIn: false,
  isCalculatingAmountOut: false,
  isCalculatingMaxAmountOutValue: false,
  shouldUpdateData: true,
  error: null,
  data: {
    tokens: [],
    pairs: [],
    fee: { value: '0', decimals: 0 },
  },
  calculatedAmountInValue: {
    amountIn: '0',
    tokenInFee: '0',
    decimals: 18,
  },
  calculatedAmountOutValue: {
    amountOut: '0',
    tokenOutFee: '0',
    decimals: 18,
  },
  calculatedMaxAmountOutValue: {
    amountOut: '0',
    decimals: 18,
  },
};

export { initialState };
