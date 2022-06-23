import { RequestStatus } from 'src/shared/helpers/redux';

type State = {
  status: RequestStatus;
  error: string | null;
  data: Data;
  isCalculatingAmountIn: boolean;
  isCalculatingAmountOut: boolean;
  isCalculatingMaxAmountOutValue: boolean;
  shouldUpdateData: boolean;
  calculatedAmountInValue: {
    amountIn: string;
    tokenInFee: string;
    decimals: number;
  };
  calculatedAmountOutValue: {
    amountOut: string;
    tokenOutFee: string;
    decimals: number;
  };
  calculatedMaxAmountOutValue: {
    amountOut: string;
    decimals: number;
  };
};

type Data = {
  tokens: Token[];
  pairs: Pair[];
  fee: Fee;
};

type Token = {
  name: string;
  symbol: string;
  address: string;
  image: string;
  userBalance: string;
  decimals: number;
};

type Pair = {
  tokens: (Token & { pairBalance: string | '' })[];
  proportion: string | 'any';
  tokenNames: [string, string];
  address: string;
  userBalance: string;
  decimals: number;
  pairNames: string;
  pairSymbol: string;
};

type Fee = {
  value: string;
  decimals: number;
};

export type { State, Token, Pair, Fee, Data };
