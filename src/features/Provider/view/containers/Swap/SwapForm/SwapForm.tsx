import { useTheme } from '@mui/material';
import { useEthers } from '@usedapp/core';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { JsonRpcSigner } from '@ethersproject/providers';

import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { Token } from 'src/features/Provider/types';
import {
  Box,
  Button,
  Card,
  Typography,
  InputAdornment,
  ArrowDown,
  CircularProgress,
} from 'src/shared/components';
import { BigNumber, parseUnits } from 'src/shared/helpers/blockchain/numbers';
import {
  calculateMinOut,
  findCurrentPair,
  shortBalance,
  getPairBalance,
} from 'src/features/Provider/utils';

import {
  calculateAmountIn,
  calculateAmountOut,
  calculateMaxAmountOut,
  resetAmountInValue,
  resetAmountOutValue,
  selectProvider,
  swapIn,
} from '../../../../redux/slice';
import {
  FieldWithAutocomplete,
  Props as FieldWithAutocompleteProps,
} from '../../../components/FieldWithAutocomplete/FieldWithAutocomplete';
import { NumberInput } from '../../../components/NumberInput/NumberInput';
import { SubmitButtonValue } from './types';
import { createStyles } from './SwapForm.style';
import { initialState, MAX_SLIPPAGE, MIN_SLIPPAGE } from './constants';
import { Hint } from './Hint/Hint';
import { changeButtonText } from './utils';

type HandleAutocompleteChange =
  FieldWithAutocompleteProps['handleAutocompleteChange'];

type Props = {
  isLoading: boolean;
  handleShowAlertClick: () => void;
  handleCloseAlertClick: () => void;
};

const SwapForm: FC<Props> = ({
  isLoading,
  handleShowAlertClick,
  handleCloseAlertClick,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const dispatch = useAppDispatch();
  const {
    data,
    isCalculatingAmountOut,
    calculatedAmountOutValue,
    isCalculatingAmountIn,
    calculatedAmountInValue,
    calculatedMaxAmountOutValue,
    isCalculatingMaxAmountOutValue,
  } = useAppSelector(selectProvider);
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
  const [activeTransaction, setActiveTransaction] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { account, library } = useEthers();

  let signer: JsonRpcSigner | null = null;

  const isAuth = library !== undefined && account !== undefined;

  if (isAuth) {
    signer = library.getSigner();
  }

  const isShouldDisabled = account === undefined || isLoading;

  const shouldButtonDisabled =
    submitButtonText !== 'Обменять' ||
    isShouldDisabled ||
    buttonDisabled ||
    new BigNumber(firstTokenValue).isZero() ||
    new BigNumber(secondTokenValue).isZero();

  useEffect(() => {
    setSubmitButtonText(
      changeButtonText({
        firstToken,
        firstTokenValue,
        isShouldDisabled,
        secondToken,
        secondTokenValue,
        activeTransaction,
      })
    );
  }, [
    firstToken,
    activeTransaction,
    firstTokenValue,
    isShouldDisabled,
    secondToken,
    secondTokenValue,
  ]);

  const { shouldReverse, currentPair } = findCurrentPair({
    pairs: data.pairs,
    firstTokenName: firstToken.name,
    secondTokenName: secondToken.name,
  });

  const [pairBalanceIn, pairBalanceOut] = getPairBalance({
    pair: currentPair,
    shouldReverse,
  });

  let maxTokenIn = '0';
  let maxTokenOut = calculatedMaxAmountOutValue.amountOut;

  if (pairBalanceIn !== null && pairBalanceOut !== null) {
    maxTokenIn = BigNumber.min(
      firstToken.userBalance,
      pairBalanceIn
    ).toString();
  }

  if (currentPair === null || maxTokenIn === '0') {
    maxTokenOut = '0';
  }

  const handleFirstTokenAutocompleteChange: HandleAutocompleteChange = (
    event,
    value
  ) => {
    const shouldReset =
      value === null || typeof value === 'string' || Array.isArray(value);
    setFirstTokenValue('');

    if (shouldReset) {
      setFirstToken(initialState.firstToken);

      return;
    }

    setFirstToken(value);
  };

  const handleSecondTokenAutocompleteChange: HandleAutocompleteChange = (
    event,
    value
  ) => {
    const shouldReset =
      value === null || typeof value === 'string' || Array.isArray(value);
    setSecondTokenValue('');

    if (shouldReset) {
      setSecondToken(initialState.secondToken);

      return;
    }

    setSecondToken(value);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    if (signer !== null && library !== undefined) {
      dispatch(
        swapIn({
          tokenInAddress: firstToken.address,
          tokenInValue: parseUnits(firstTokenValue, firstToken.decimals),
          tokenOutAddress: secondToken.address,
          tokenOutMin: parseUnits(
            calculateMinOut({
              amountOut: secondTokenValue,
              slippage: Number(slippage),
              decimals: secondToken.decimals,
            }),
            secondToken.decimals
          ),
          provider: library,
          signer,
        })
      ).then(() => {
        handleShowAlertClick();
        setActiveTransaction(false);
      });

      setFirstTokenValue('');
      setFirstToken(initialState.firstToken);
      setSecondToken(initialState.secondToken);
      setSecondTokenValue('');
      handleCloseAlertClick();
      setActiveTransaction(true);
    }
  };

  const handleFirstTokenValueChange = (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    setFirstTokenValue((prevValue) => {
      if (event.currentTarget === null) return prevValue;
      const newValue = event.currentTarget.value;

      if (Number.isNaN(Number(newValue))) {
        return prevValue;
      }

      return newValue;
    });

    const newValue = event.currentTarget.value;
    const shouldUpdate =
      currentPair !== null &&
      library !== undefined &&
      !Number.isNaN(Number(newValue)) &&
      newValue !== '' &&
      +newValue > 0 &&
      +newValue <= +maxTokenIn;

    if (shouldUpdate) {
      dispatch(
        calculateAmountOut({
          pairAddress: currentPair.address,
          tokenInAddress: firstToken.address,
          tokenOutAddress: secondToken.address,
          amountIn: parseUnits(newValue, firstToken.decimals),
          provider: library,
        })
      );
    }

    if (newValue === '0' || newValue === '') {
      dispatch(resetAmountOutValue());
    }
  };

  const handleSecondTokenValueChange = (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    setSecondTokenValue((prevValue) => {
      if (event.currentTarget === null) return prevValue;
      const newValue = event.currentTarget.value;

      if (Number.isNaN(Number(newValue))) {
        return prevValue;
      }

      return newValue;
    });

    const newValue = event.currentTarget.value;
    const shouldUpdate =
      currentPair !== null &&
      library !== undefined &&
      !Number.isNaN(Number(newValue)) &&
      newValue !== '' &&
      +newValue > 0 &&
      +newValue <= +maxTokenOut;

    if (shouldUpdate) {
      dispatch(
        calculateAmountIn({
          pairAddress: currentPair.address,
          tokenInAddress: firstToken.address,
          tokenOutAddress: secondToken.address,
          amountOut: parseUnits(newValue, secondToken.decimals),
          provider: library,
        })
      );
    }

    if (newValue === '' || newValue === '0') {
      dispatch(resetAmountInValue());
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

  const handelButtonDisabled = (shouldDisabledButton: boolean) => {
    setButtonDisabled(shouldDisabledButton);
  };

  const handleMaxClick = () => {
    const isTokensChosen = firstToken.name !== '' && secondToken.name !== '';
    const isValueNotZero = maxTokenIn !== '0';
    const shouldCalculate = isTokensChosen && isValueNotZero;

    if (shouldCalculate) {
      setFirstTokenValue(maxTokenIn);

      if (currentPair !== null && library !== undefined) {
        dispatch(
          calculateAmountOut({
            pairAddress: currentPair.address,
            tokenInAddress: firstToken.address,
            tokenOutAddress: secondToken.address,
            amountIn: parseUnits(maxTokenIn, firstToken.decimals),
            provider: library,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (firstToken.address !== '') {
      const actualFirstToken = tokens.filter(
        (token) => token.address === firstToken.address
      );

      setFirstToken(actualFirstToken[0]);
    }

    if (secondToken.address !== '') {
      const actualSecondToken = tokens.filter(
        (token) => token.address === secondToken.address
      );

      setSecondToken(actualSecondToken[0]);
    }
  }, [tokens]);

  useEffect(() => {
    if (currentPair !== null) {
      setFirstTokenValue(calculatedAmountInValue.amountIn);
    }
  }, [calculatedAmountInValue.amountIn]);

  useEffect(() => {
    if (currentPair !== null) {
      setSecondTokenValue(calculatedAmountOutValue.amountOut);
    }
  }, [calculatedAmountOutValue.amountOut]);

  useEffect(() => {
    const isValueZero = new BigNumber(maxTokenIn).isZero();
    const shouldCalculate =
      currentPair !== null && library !== undefined && !isValueZero;

    if (shouldCalculate) {
      dispatch(
        calculateMaxAmountOut({
          pairAddress: currentPair.address,
          tokenInAddress: firstToken.address,
          tokenOutAddress: secondToken.address,
          amountIn: parseUnits(maxTokenIn, firstToken.decimals),
          provider: library,
        })
      );
    }
  }, [calculatedMaxAmountOutValue.amountOut, currentPair]);

  return (
    <Card
      css={styles.root()}
      content={{
        children: (
          <form onSubmit={handleSubmit}>
            <Box>
              <Typography>Обменять</Typography>
            </Box>
            <Box css={styles.inputBox()}>
              <FieldWithAutocomplete
                inputProps={{
                  value: firstTokenValue,
                  disabled: isShouldDisabled || isCalculatingMaxAmountOutValue,
                  onChange: handleFirstTokenValueChange,
                }}
                balance={shortBalance(firstToken.userBalance)}
                disabled={isShouldDisabled}
                handleAutocompleteChange={handleFirstTokenAutocompleteChange}
                options={tokens.filter(
                  (token) => token.name !== secondToken.name
                )}
                isMaxBtnDisplayed
                max={shortBalance(maxTokenIn)}
                handleMaxClick={handleMaxClick}
                optionsValue={firstToken}
                isCalculating={isCalculatingAmountIn}
                css={styles.input()}
              />
              {isCalculatingAmountIn && (
                <CircularProgress css={styles.progress()}></CircularProgress>
              )}
            </Box>
            <Box css={styles.arrow()}>
              <ArrowDown></ArrowDown>
            </Box>
            <Box css={styles.inputBox()}>
              <FieldWithAutocomplete
                inputProps={{
                  value: secondTokenValue,
                  onChange: handleSecondTokenValueChange,
                  disabled: isShouldDisabled || isCalculatingMaxAmountOutValue,
                }}
                balance={shortBalance(secondToken.userBalance)}
                options={tokens.filter(
                  (token) => token.name !== firstToken.name
                )}
                handleAutocompleteChange={handleSecondTokenAutocompleteChange}
                disabled={isShouldDisabled}
                max={shortBalance(maxTokenOut)}
                isCalculatingMaxAmountOutValue={isCalculatingMaxAmountOutValue}
                optionsValue={secondToken}
                isCalculating={isCalculatingAmountOut}
                css={styles.input()}
              />
              {isCalculatingAmountOut && (
                <CircularProgress css={styles.progress()}></CircularProgress>
              )}
            </Box>
            <Hint
              pair={currentPair}
              firstToken={firstToken}
              secondToken={secondToken}
              firstTokenValue={firstTokenValue}
              secondTokenValue={secondTokenValue}
              slippage={+slippage}
              maxTokenIn={maxTokenIn}
              handelButtonDisabled={handelButtonDisabled}
            ></Hint>
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
              disabled={shouldButtonDisabled}
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
