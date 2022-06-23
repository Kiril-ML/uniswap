import { Pair, Token } from 'src/features/Provider/types';
import { BigNumber } from 'src/shared/helpers/blockchain/numbers';

type Args = {
  pair: Pair | null;
  firstToken: Token;
  secondToken: Token;
  shouldReverse: boolean;
};

const calculateProportion = ({
  pair,
  firstToken,
  secondToken,
  shouldReverse,
}: Args) => {
  if (pair === null || pair.proportion === 'any') return null;

  const isTokensChosen = firstToken.name !== '' && secondToken.name !== '';
  const shouldCalculateProportion = pair !== null && isTokensChosen;

  if (!shouldCalculateProportion) return null;

  const proportionBigNumber = new BigNumber(pair.proportion);
  const proportion = shouldReverse
    ? new BigNumber(1).div(proportionBigNumber).toString()
    : proportionBigNumber.toString();

  return proportion;
};

export { calculateProportion };
