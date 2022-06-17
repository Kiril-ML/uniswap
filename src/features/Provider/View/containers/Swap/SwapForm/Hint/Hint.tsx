/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react';

import { Pair, Token } from 'src/features/Provider/types';
import { BigNumber } from 'src/shared/helpers/blockchain/numbers';

type Props = {
  pair: Pair;
  firstToken: Token;
  secondToken: Token;
  firstTokenValue: string;
  secondTokenValue: string;
  shouldReverse: boolean;
};

const Hint: FC<Props> = ({
  pair,
  firstToken,
  secondToken,
  firstTokenValue,
  secondTokenValue,
  shouldReverse,
}) => {
  const swapOutValue = new BigNumber('1').dividedBy(pair.proportion).toFixed(5);
  const proportionHint = `1 ${firstToken.name} = ${new BigNumber(swapOutValue)
    .decimalPlaces(5)
    .toString()} ${secondToken.name}`;
  const commissionHint = `комиссия: ${new BigNumber(secondTokenValue)
    .minus(new BigNumber(firstTokenValue).times(pair.proportion))
    .abs()
    .decimalPlaces(5)
    .toString()} ${secondToken.name}`;
  // const slippageHint = `минимально получите: ${new BigNumber(
  //   calculateMinOut({
  //     amountOut: secondTokenValue,
  //     slippage,
  //     decimals: secondToken.decimals,
  //   })
  // )
  //   .decimalPlaces(5)
  //   .toString()} ${secondToken.name}`;

  return <></>;
};

export type { Props };

export { Hint };
