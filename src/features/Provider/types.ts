import { RequestStatus } from 'src/shared/helpers/redux';

type State = {
  status: RequestStatus;
  error: string | null;
  data: {
    tokens: Token[];
    pairs: Pair[];
    fee: Fee;
  };
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
};

type Fee = {
  value: string;
  decimals: number;
};

export type { State, Token, Pair, Fee };
