import { FC } from 'react';
import { useTheme } from '@mui/material';

import { Pair, Token } from 'src/features/Provider/types';
import { Box, Typography } from 'src/shared/components';
import { BigNumber } from 'src/shared/helpers/blockchain/numbers';

import { createStyles } from './Hint.style';

type Props = {
  pair: Pair | null;
  firstToken: Token;
  secondToken: Token;
  firstTokenValue: string;
  secondTokenValue: string;
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
  shouldReverse,
  maxTokenIn,
  maxTokenOut,
  handelButtonDisabled,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  let proportionHint = '';
  let pairHint = '';

  const isTokensChosen = firstToken.name !== '' && secondToken.name !== '';
  const isValueBiggerMax =
    isTokensChosen &&
    (+maxTokenIn < +firstTokenValue || +maxTokenOut < +secondTokenValue);

  const isPairExist = !(isTokensChosen && pair === null);
  handelButtonDisabled(isValueBiggerMax);

  const isInsufficientUserBalance =
    isTokensChosen &&
    (new BigNumber(firstToken.userBalance).decimalPlaces(5).lt('0.00001') ||
      new BigNumber(secondToken.userBalance).decimalPlaces(5).lt('0.00001'));

  const shouldCalculateProportion =
    pair !== null && isTokensChosen && !isInsufficientUserBalance;

  if (shouldCalculateProportion) {
    switch (pair.proportion) {
      case 'any': {
        proportionHint = 'Пропорция любая';

        break;
      }
      case '': {
        proportionHint = '';

        break;
      }
      default: {
        const proportion = shouldReverse
          ? 1 / +pair.proportion
          : pair.proportion;

        proportionHint = `Пропорция: ${new BigNumber(proportion)
          .decimalPlaces(5)
          .toString()}`;

        break;
      }
    }
  }

  if (!isPairExist) {
    proportionHint = 'Пропорция любая';
    pairHint = `Данной пары ещё не существует`;
  }

  return (
    <Box css={styles.root()}>
      {isValueBiggerMax && (
        <Typography css={styles.insufficientAmount()} color="error">
          Неверное количество
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

      {!isPairExist && (
        <>
          <Typography css={styles.caption()}>{proportionHint}</Typography>
          <Typography css={styles.caption()}>{pairHint}</Typography>
        </>
      )}
    </Box>
  );
};

export type { Props };

export { Hint };
