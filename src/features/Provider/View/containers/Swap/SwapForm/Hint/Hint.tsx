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
  maxTokenIn: string;
  maxTokenOut: string;
  handelButtonDisabled: (shouldDisabledButton: boolean) => void;
};

const Hint: FC<Props> = ({
  pair,
  firstToken,
  secondToken,
  firstTokenValue,
  secondTokenValue,
  slippage,
  shouldReverse,
  maxTokenIn,
  maxTokenOut,
  handelButtonDisabled,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  let proportionHint = '';
  let commissionHint = '';
  let slippageHint = '';

  const isTokensChosen = firstToken.name !== '' && secondToken.name !== '';
  const isValueBiggerMax =
    isTokensChosen &&
    (+maxTokenIn < +firstTokenValue || +maxTokenOut < +secondTokenValue);

  handelButtonDisabled(isValueBiggerMax);

  const isInsufficientLiquidity = pair?.proportion === 'any';
  const isPairExist = !(isTokensChosen && pair === null);

  const isInsufficientUserBalance =
    isTokensChosen &&
    (new BigNumber(firstToken.userBalance).decimalPlaces(5).lt('0.00001') ||
      new BigNumber(secondToken.userBalance).decimalPlaces(5).lt('0.00001'));

  const shouldCalculateProportion =
    pair !== null &&
    isTokensChosen &&
    !isInsufficientLiquidity &&
    !isInsufficientUserBalance &&
    isPairExist;

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
      {isInsufficientLiquidity && (
        <Typography css={styles.insufficientAmount()} color="error">
          Недостаточно ликвидности
        </Typography>
      )}
      {isValueBiggerMax && (
        <Typography css={styles.insufficientAmount()} color="error">
          Неверное количество
        </Typography>
      )}
      {!isPairExist && (
        <Typography css={styles.insufficientAmount()} color="error">
          Выбранная пара не найдена в пуле ликвидности
        </Typography>
      )}
      {isInsufficientUserBalance && (
        <Typography css={styles.insufficientAmount()} color="error">
          Недостаточно средств
        </Typography>
      )}
      {shouldCalculateProportion && (
        <Typography css={styles.caption()}>{proportionHint}</Typography>
      )}
      {shouldCalculateCommission && !isValueBiggerMax && (
        <Typography css={styles.caption()}>{commissionHint}</Typography>
      )}
      {shouldCalculateCommission && !isValueBiggerMax && (
        <Typography css={styles.caption()}>{slippageHint}</Typography>
      )}
    </Box>
  );
};

export type { Props };

export { Hint };
