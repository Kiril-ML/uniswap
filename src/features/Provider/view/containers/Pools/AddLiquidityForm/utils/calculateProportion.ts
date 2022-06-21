import { Pair, Token } from 'src/features/Provider/types';

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
  if (pair === null) return null;

  const isTokensChosen = firstToken.name !== '' && secondToken.name !== '';
  const shouldCalculateProportion = pair !== null && isTokensChosen;

  if (!shouldCalculateProportion) return null;

  const proportion = shouldReverse ? 1 / +pair.proportion : pair.proportion;

  return typeof proportion === 'number' ? proportion.toString() : proportion;
};

export { calculateProportion };
