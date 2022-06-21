import { Pair, Token } from 'src/features/Provider/types';
import { BigNumber } from 'src/shared/helpers/blockchain/numbers';

type Args = {
  pair: Pair | null;
  firstToken: Token;
  secondToken: Token;
  shouldReverse: boolean;
};

const calculateMaxValue = ({
  pair,
  firstToken,
  secondToken,
  shouldReverse,
}: Args) => {
  const isTokensChosen = firstToken.name !== '' && secondToken.name !== '';
  const wasPairNotFound = isTokensChosen && pair === null;

  if (wasPairNotFound) return [firstToken.userBalance, secondToken.userBalance];

  if (pair === null) return ['0', '0'];

  if (pair.proportion === 'any') {
    return [firstToken.userBalance, secondToken.userBalance];
  }

  const proportion = shouldReverse ? 1 / +pair.proportion : pair.proportion;

  const maxToken2 = new BigNumber(firstToken.userBalance)
    .div(proportion)
    .toString();
  const token2MaxToSet = new BigNumber(maxToken2).gt(secondToken.userBalance)
    ? secondToken.userBalance
    : maxToken2;

  const maxToken1 = new BigNumber(secondToken.userBalance)
    .times(proportion)
    .toString();
  const token1MaxToSet = new BigNumber(maxToken1).gt(firstToken.userBalance)
    ? firstToken.userBalance
    : maxToken1;

  return [token1MaxToSet, token2MaxToSet];
};

export { calculateMaxValue };
