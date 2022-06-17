import { FC } from 'react';
import { useTheme } from '@mui/material';

import { Pair, Token } from 'src/features/Provider/types';
import { calculateMinOut } from 'src/features/Provider/utils';
import { Box, Typography } from 'src/shared/components';
import { BigNumber } from 'src/shared/helpers/blockchain/numbers';

import { createStyles } from './Hint.style';

type Props = {
  pair: Pair | null;
  firstToken: Token;
  secondToken: Token;
  firstTokenValue: string;
  secondTokenValue: string;
  slippage: number;
  shouldReverse: boolean;
};

const Hint: FC<Props> = ({
  pair,
  firstToken,
  secondToken,
  firstTokenValue,
  secondTokenValue,
  slippage,
  shouldReverse,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  let proportionHint = '';
  let commissionHint = '';
  let slippageHint = '';

  const shouldCalculateProportion =
    pair !== null && firstToken.name !== '' && secondToken.name !== '';

  if (shouldCalculateProportion) {
    const proportion = shouldReverse ? 1 / +pair.proportion : pair.proportion;
    const swapOutValue = new BigNumber('1').dividedBy(proportion).toFixed(5);
    proportionHint = `1 ${firstToken.name} = ${new BigNumber(swapOutValue)
      .decimalPlaces(5)
      .toString()} ${secondToken.name}`;
  }

  const shouldCalculateCommission =
    shouldCalculateProportion &&
    firstTokenValue !== '' &&
    secondTokenValue !== '';

  if (shouldCalculateCommission) {
    const proportion =
      +pair.proportion > 1
        ? new BigNumber('1').div(pair.proportion).toString()
        : pair.proportion;

    commissionHint = `комиссия: ${new BigNumber(secondTokenValue)
      .minus(new BigNumber(firstTokenValue).times(proportion))
      .abs()
      .decimalPlaces(5)
      .toString()} ${secondToken.name}`;

    slippageHint = `минимально получите: ${new BigNumber(
      calculateMinOut({
        amountOut: secondTokenValue,
        slippage,
        decimals: secondToken.decimals,
      })
    )
      .decimalPlaces(5)
      .toString()} ${secondToken.name}`;
  }

  return (
    <Box css={styles.root()}>
      {shouldCalculateProportion && (
        <Typography css={styles.caption()}>{proportionHint}</Typography>
      )}
      {shouldCalculateCommission && (
        <Typography css={styles.caption()}>{commissionHint}</Typography>
      )}
      {shouldCalculateCommission && (
        <Typography css={styles.caption()}>{slippageHint}</Typography>
      )}
    </Box>
  );
};

export type { Props };

export { Hint };
