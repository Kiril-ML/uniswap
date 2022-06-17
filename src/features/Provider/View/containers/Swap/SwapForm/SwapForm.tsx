/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTheme } from '@mui/material';
import { useEthers } from '@usedapp/core';
import { FC, ReactElement, SyntheticEvent, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { Token } from 'src/features/Provider/types';
import {
  Box,
  Button,
  Card,
  Typography,
  InputAdornment,
  ArrowDown,
} from 'src/shared/components';
import {
  BigNumber,
  formatUnits,
  parseUnits,
} from 'src/shared/helpers/blockchain/numbers';
import { calculateSwapIn } from 'src/features/Provider/utils';

import { selectProvider, swapIn } from '../../../../redux/slice';
import {
  FieldWithAutocomplete,
  Props as FieldWithAutocompleteProps,
} from '../../../components/FieldWithAutocomplete/FieldWithAutocomplete';
import { NumberInput } from '../../../components/NumberInput/NumberInput';
import { SubmitButtonValue } from '../types';
import { createStyles } from './SwapForm.style';
import { initialState, MAX_SLIPPAGE, MIN_SLIPPAGE } from './constants';
import { changeButtonText } from './utils/changeButtonText';
import { shortBalance } from './utils/shortBalance';

type HandleAutocompleteChange =
  FieldWithAutocompleteProps['handleAutocompleteChange'];

type Props = {
  isLoading: boolean;
  hint?: ReactElement;
};

const SwapForm: FC<Props> = ({ hint, isLoading }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectProvider);
  const { tokens } = data;

  const [firstToken, setFirstToken] = useState<Token>(initialState.firstToken);
  const [firstTokenValue, setFirstTokenValue] = useState('');
  const [secondToken, setSecondToken] = useState<Token>(
    initialState.secondToken
  );
  const [secondTokenValue, setSecondTokenValue] = useState('');
  const [slippage, setSlippage] = useState<number | string>(
    initialState.slippage
  );
  const [submitButtonText, setSubmitButtonText] =
    useState<SubmitButtonValue>('Подключите кошелек');

  const { account, library } = useEthers();
  const isShouldDisabled = account === undefined || isLoading;

  useEffect(() => {
    setSubmitButtonText(
      changeButtonText({
        firstToken,
        firstTokenValue,
        isShouldDisabled,
        secondToken,
        secondTokenValue,
      })
    );
  }, [
    firstToken,
    firstTokenValue,
    isShouldDisabled,
    secondToken,
    secondTokenValue,
  ]);

  const handleFirstTokenAutocompleteChange: HandleAutocompleteChange = (
    event,
    value
  ) => {
    if (value === null) {
      setFirstToken(initialState.firstToken);

      return;
    }

    setFirstToken(value);
  };

  const handleSecondTokenAutocompleteChange: HandleAutocompleteChange = (
    event,
    value
  ) => {
    if (value === null) {
      setSecondToken(initialState.secondToken);

      return;
    }

    setSecondToken(value);
  };

  let shouldReverse = false;
  const currentPair = data.pairs.filter((pair) => {
    const stringPairNames = pair.tokenNames.join('');
    const stringFormNames = `${firstToken.name}${secondToken.name}`;
    const reverseStringFormNames = `${secondToken.name}${firstToken.name}`;

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

  let signer;

  if (account !== undefined) {
    signer = library?.getSigner();
  }

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    dispatch(
      swapIn({
        tokenInAddress: firstToken.address,
        tokenInValue: parseUnits(firstTokenValue, firstToken.decimals),
        tokenOutAddress: secondToken.address,
        tokenOutMin: parseUnits(secondTokenValue, secondToken.decimals),
        provider: library,
        signer,
      })
    );

    // console.log(data, 'data');
  };

  const handleFirstTokenValueChange = (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget !== undefined) {
      setFirstTokenValue(() => {
        if (firstToken.name !== '' && secondToken.name !== '') {
          const secondValue =
            +event.currentTarget.value / +currentPair[0].proportion;
          setSecondTokenValue(secondValue.toFixed(4));
        }

        return event.currentTarget.value;
      });
    }
  };

  const handleSecondTokenValueChange = (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget !== undefined) {
      setSecondTokenValue(() => {
        if (firstToken.name !== '' && secondToken.name !== '') {
          const secondValue =
            +event.currentTarget.value / +currentPair[0].proportion;
          setFirstTokenValue(secondValue.toFixed(4));
        }

        return event.currentTarget.value;
      });
    }
  };

  const handleSlippageChange = (
    event: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = Number(event.currentTarget.value);

    if (newValue <= MAX_SLIPPAGE && newValue >= MIN_SLIPPAGE) {
      setSlippage(event.currentTarget.value.slice(0, 5));
    }
  };

  let maxTokenIn = '0';
  let tokenOutMaxToSet = '0';

  if (currentPair.length !== 0) {
    maxTokenIn = BigNumber.min(
      firstToken.userBalance,
      currentPair[0].tokens[0].pairBalance
    ).toString();

    tokenOutMaxToSet = calculateSwapIn({
      amountIn: parseUnits(maxTokenIn, firstToken.decimals),
      balanceIn: parseUnits(
        currentPair[0].tokens[0].pairBalance,
        firstToken.decimals
      ),
      balanceOut: parseUnits(
        currentPair[0].tokens[1].pairBalance,
        secondToken.decimals
      ),
      fee: {
        amount: parseUnits(data.fee.value, data.fee.decimals),
        decimals: data.fee.decimals,
      },
      decimals: Math.max(firstToken.decimals, secondToken.decimals),
    });
  }

  // console.log(currentPair, 'currentPair', swapOutValue);

  return (
    <Card
      css={styles.root()}
      content={{
        children: (
          <form onSubmit={handleSubmit}>
            <Box>
              <Typography>Обменять</Typography>
            </Box>
            <FieldWithAutocomplete
              inputProps={{
                value: firstTokenValue,
                disabled: isShouldDisabled,
                onChange: handleFirstTokenValueChange,
              }}
              balance={shortBalance(firstToken.userBalance)}
              disabled={isShouldDisabled}
              handleAutocompleteChange={handleFirstTokenAutocompleteChange}
              options={tokens.filter(
                (token) => token.name !== secondToken.name
              )}
              isMaxBtnDisplayed
              max={maxTokenIn}
            />
            <Box css={styles.arrow()}>
              <ArrowDown></ArrowDown>
            </Box>
            <FieldWithAutocomplete
              inputProps={{
                value: secondTokenValue,
                onChange: handleSecondTokenValueChange,
                disabled: isShouldDisabled,
              }}
              balance={shortBalance(secondToken.userBalance)}
              options={tokens.filter((token) => token.name !== firstToken.name)}
              handleAutocompleteChange={handleSecondTokenAutocompleteChange}
              disabled={isShouldDisabled}
              max={tokenOutMaxToSet}
            />
            {hint}
            <Box>
              <Typography>Допустимое проскальзывание ?</Typography>
              <NumberInput
                variant="filled"
                InputProps={{
                  value: slippage,
                  onChange: handleSlippageChange,
                  disableUnderline: true,
                  disabled: isShouldDisabled,
                  endAdornment: (
                    <InputAdornment position="end" orientation={'horizontal'}>
                      %
                    </InputAdornment>
                  ),
                }}
              ></NumberInput>
            </Box>
            <Button
              type="submit"
              css={styles.button()}
              variant="contained"
              fullWidth
              disabled={isShouldDisabled}
            >
              {submitButtonText}
            </Button>
          </form>
        ),
      }}
    ></Card>
  );
};

export type { Props };

export { SwapForm };
