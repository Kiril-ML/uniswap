import { FC } from 'react';
import { useTheme } from '@mui/material';

import { Pair, Token } from 'src/features/Provider/types';
import { calculateMinOut } from 'src/features/Provider/utils';
import { Box, CircularProgress, Typography } from 'src/shared/components';
import { BigNumber } from 'src/shared/helpers/blockchain/numbers';
import { useAppSelector } from 'src/app/hooks';
import { selectProvider } from 'src/features/Provider/redux/selectors';

import { createStyles } from './Hint.style';

type Props = {
  pair: Pair | null;
  firstToken: Token;
  secondToken: Token;
  firstTokenValue: string;
  secondTokenValue: string;
  slippage: number;
  maxTokenIn: string;
  onDisabled: (shouldDisabledButton: boolean) => void;
};

const Hint: FC<Props> = ({
  pair,
  firstToken,
  secondToken,
  firstTokenValue,
  secondTokenValue,
  slippage,
  maxTokenIn,
  onDisabled,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const {
    isCalculatingAmountOut,
    isCalculatingAmountIn,
    isCalculatingMaxAmountOutValue,
    calculatedMaxAmountOutValue,
    calculatedAmountOutValue,
  } = useAppSelector(selectProvider);

  let commissionHint = '';
  let slippageHint = '';

  const isCalculating =
    isCalculatingAmountOut ||
    isCalculatingAmountIn ||
    isCalculatingMaxAmountOutValue;

  const isTokensChosen = firstToken.name !== '' && secondToken.name !== '';
  const isValueChosen =
    firstTokenValue !== '' &&
    secondTokenValue !== '' &&
    firstTokenValue !== '0' &&
    secondTokenValue !== '0';

  const shouldShowProgress = isCalculating && isValueChosen;

  const isValueBiggerMax =
    isTokensChosen &&
    (+maxTokenIn < +firstTokenValue ||
      +calculatedMaxAmountOutValue.amountOut < +secondTokenValue);

  onDisabled(isValueBiggerMax);

  const isInsufficientLiquidity = pair?.proportion === 'any';
  const isPairExist = !(isTokensChosen && pair === null);

  const isInsufficientUserBalance =
    isTokensChosen &&
    (new BigNumber(firstToken.userBalance).decimalPlaces(5).lt('0.00001') ||
      new BigNumber(secondToken.userBalance).decimalPlaces(5).lt('0.00001'));

  const shouldCalculateCommission =
    isTokensChosen &&
    !isInsufficientLiquidity &&
    !isInsufficientUserBalance &&
    isPairExist &&
    isValueChosen;

  if (shouldCalculateCommission) {
    commissionHint = `комиссия: ${new BigNumber(
      calculatedAmountOutValue.tokenOutFee
    ).toFixed(6)} ${secondToken.name}`;

    slippageHint = `минимально получите: ${new BigNumber(
      calculateMinOut({
        amountOut: secondTokenValue,
        slippage,
        decimals: secondToken.decimals,
      })
    )
      .decimalPlaces(6)
      .toString()} ${secondToken.name}`;
  }

  return (
    <Box css={styles.root()}>
      {shouldShowProgress ? (
        <CircularProgress></CircularProgress>
      ) : (
        <>
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

          {shouldCalculateCommission && !isValueBiggerMax && (
            <Typography css={styles.caption()}>{commissionHint}</Typography>
          )}
          {shouldCalculateCommission && !isValueBiggerMax && (
            <Typography css={styles.caption()}>{slippageHint}</Typography>
          )}
        </>
      )}
    </Box>
  );
};

export type { Props };

export { Hint };
