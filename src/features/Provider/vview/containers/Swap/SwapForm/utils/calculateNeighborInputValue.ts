import { Data, Token } from 'src/features/Provider/types';
import { calculateSwapIn, calculateSwapOut } from 'src/features/Provider/utils';
import { parseUnits } from 'src/shared/helpers/blockchain/numbers';

type Args = {
  newValue: string;
  firstToken: Token;
  secondToken: Token;
  pairBalanceIn: string | null;
  pairBalanceOut: string | null;
  data: Data;
  neighbor: 'first' | 'second';
};

const calculateNeighborInputValue = ({
  newValue,
  firstToken,
  secondToken,
  pairBalanceIn,
  pairBalanceOut,
  data,
  neighbor,
}: Args) => {
  let newNeighborValue = '';

  const shouldResetNeighborValue =
    firstToken.name !== '' && secondToken.name !== '' && newValue === '';

  const shouldUpdateNeighborValue =
    firstToken.name !== '' &&
    secondToken.name !== '' &&
    !Number.isNaN(Number(newValue)) &&
    newValue !== '' &&
    pairBalanceIn !== null &&
    pairBalanceOut !== null;

  if (shouldUpdateNeighborValue) {
    if (neighbor === 'first') {
      const calculatedValue = calculateSwapIn({
        amountOut: parseUnits(newValue, firstToken.decimals),
        balanceIn: parseUnits(pairBalanceIn, firstToken.decimals),
        balanceOut: parseUnits(pairBalanceOut, secondToken.decimals),
        fee: {
          amount: parseUnits(data.fee.value, data.fee.decimals),
          decimals: data.fee.decimals,
        },
        decimals: Math.max(firstToken.decimals, secondToken.decimals),
      });

      newNeighborValue = +calculatedValue < 0 ? '' : calculatedValue;
    } else if (neighbor === 'second') {
      const calculatedValue = calculateSwapOut({
        amountIn: parseUnits(newValue, firstToken.decimals),
        balanceIn: parseUnits(pairBalanceIn, firstToken.decimals),
        balanceOut: parseUnits(pairBalanceOut, secondToken.decimals),
        fee: {
          amount: parseUnits(data.fee.value, data.fee.decimals),
          decimals: data.fee.decimals,
        },
        decimals: Math.max(firstToken.decimals, secondToken.decimals),
      });
      newNeighborValue = +calculatedValue < 0 ? '' : calculatedValue;
    }
  }

  return {
    shouldUpdateNeighborValue,
    newNeighborValue,
    shouldResetNeighborValue,
  };
};

export { calculateNeighborInputValue };
