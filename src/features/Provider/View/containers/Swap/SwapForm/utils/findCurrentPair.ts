import { Pair } from 'src/features/Provider/types';

const findCurrentPair = ({
  pairs,
  firstTokenName,
  secondTokenName,
}: {
  pairs: Pair[];
  firstTokenName: string;
  secondTokenName: string;
}) => {
  let shouldReverse = false;

  const currentPair = pairs.filter((pair) => {
    const stringPairNames = pair.tokenNames.join('');
    const stringFormNames = `${firstTokenName}${secondTokenName}`;
    const reverseStringFormNames = `${secondTokenName}${firstTokenName}`;

    if (stringPairNames === stringFormNames) {
      shouldReverse = false;

      return true;
    }

    if (stringPairNames === reverseStringFormNames) {
      shouldReverse = true;

      return true;
    }

    shouldReverse = false;

    return false;
  });

  if (currentPair.length !== 0) {
    return { currentPair: currentPair[0], shouldReverse };
  }

  return null;
};

export { findCurrentPair };
