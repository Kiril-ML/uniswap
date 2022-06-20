import { Pair } from 'src/features/Provider/types';

type Args = {
  pair: Pair | null;
  shouldReverse: boolean;
};
const getPairBalance = ({ pair, shouldReverse }: Args) => {
  if (pair === null) return [null, null];

  let [balanceIn, balanceOut] = Object.values(pair.tokens).map(
    (token) => token.pairBalance
  );

  [balanceIn, balanceOut] = shouldReverse
    ? [balanceOut, balanceIn]
    : [balanceIn, balanceOut];

  return [balanceIn, balanceOut];
};

export { getPairBalance };
