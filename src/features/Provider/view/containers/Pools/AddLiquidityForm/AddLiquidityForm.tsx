import { Button, Typography, useTheme } from '@mui/material';
import { useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import {
  Dispatch,
  FC,
  SetStateAction,
  SyntheticEvent,
  useState,
  useEffect,
} from 'react';

import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { selectProvider } from 'src/features/Provider/redux/selectors';
import { addLiquidity } from 'src/features/Provider/redux/thunks';
import { Token } from 'src/features/Provider/types';
import { findCurrentPair, shortBalance } from 'src/features/Provider/utils';
import { Box, Card, WifiProtectedSetup } from 'src/shared/components';
import { BigNumber, parseUnits } from 'src/shared/helpers/blockchain/numbers';

import {
  FieldWithAutocomplete,
  Props as FieldWithAutocompleteProps,
} from '../../../components/FieldWithAutocomplete/FieldWithAutocomplete';
import { initialState } from '../../Swap/SwapForm/constants';
import { createStyles } from './AddLiquidityForm.style';
import { Hint } from './Hint/Hint';
import { SubmitButtonValue } from './types';
import { calculateMaxValue, calculateProportion } from './utils';
import { changeButtonText } from './utils/changeButtonText';

type HandleAutocompleteChange =
  FieldWithAutocompleteProps['handleAutocompleteChange'];

type Props = {
  handleChangeForm: Dispatch<
    SetStateAction<'RemoveLiquidity' | 'AddLiquidity'>
  >;
  isLoading: boolean;
  handleShowAlertClick: () => void;
  handleCloseAlertClick: () => void;
};

const AddLiquidityForm: FC<Props> = ({
  handleChangeForm,
  isLoading,
  handleShowAlertClick,
  handleCloseAlertClick,
}) => {
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
  const [activeTransaction, setActiveTransaction] = useState(false);
  const [submitButtonText, setSubmitButtonText] =
    useState<SubmitButtonValue>('Подключите кошелек');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { account, library } = useEthers();

  let signer: ethers.providers.JsonRpcSigner | null = null;

  const isAuth = library !== undefined && account !== undefined;

  if (isAuth) {
    signer = library.getSigner();
  }

  const isShouldDisabled = account === undefined || isLoading;

  const shouldButtonDisabled =
    submitButtonText !== 'Добавить ликвидность' ||
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

  const onClickChangeForm = () => {
    handleChangeForm('RemoveLiquidity');
    handleCloseAlertClick();
  };

  const handleFirstTokenAutocompleteChange: HandleAutocompleteChange = (
    event,
    value
  ) => {
    const shouldReset =
      value === null || typeof value === 'string' || Array.isArray(value);

    if (shouldReset) {
      setFirstToken(initialState.firstToken);
      setFirstTokenValue('');

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

    if (shouldReset) {
      setSecondToken(initialState.secondToken);
      setSecondTokenValue('');

      return;
    }

    setSecondToken(value);
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

    const proportion = calculateProportion({
      pair: currentPair,
      firstToken,
      secondToken,
      shouldReverse,
    });

    const shouldUpdate =
      !Number.isNaN(Number(event.currentTarget.value)) &&
      event.currentTarget.value !== '' &&
      proportion !== null;

    if (shouldUpdate) {
      const newValue = new BigNumber(event.currentTarget.value)
        .div(proportion)
        .toString();
      setSecondTokenValue(newValue);
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

    const proportion = calculateProportion({
      pair: currentPair,
      firstToken,
      secondToken,
      shouldReverse,
    });

    const shouldUpdate =
      !Number.isNaN(Number(event.currentTarget.value)) &&
      event.currentTarget.value !== '' &&
      proportion !== null;

    if (shouldUpdate) {
      const newValue = new BigNumber(event.currentTarget.value)
        .times(proportion)
        .toString();
      setFirstTokenValue(newValue);
    }
  };

  const [maxFirstToken, maxSecondToken] = calculateMaxValue({
    pair: currentPair,
    firstToken,
    secondToken,
    shouldReverse,
  });

  const handelButtonDisabled = (shouldDisabledButton: boolean) => {
    setButtonDisabled(shouldDisabledButton);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    const shouldDispatch = library !== undefined && currentPair !== null;

    if (shouldDispatch && signer !== null) {
      dispatch(
        addLiquidity({
          tokenInAddress: firstToken.address,
          tokenInValue: parseUnits(firstTokenValue, firstToken.decimals),
          tokenOutAddress: secondToken.address,
          tokenOutValue: parseUnits(secondTokenValue, secondToken.decimals),
          isProportionNaN: currentPair.proportion === 'NaN',
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

  const handleMaxClick = () => {
    const isTokensChosen = firstToken.name !== '' && secondToken.name !== '';

    if (isTokensChosen) {
      setFirstTokenValue(maxFirstToken);
      setSecondTokenValue(maxSecondToken);
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

  return (
    <Card
      css={styles.root()}
      content={{
        children: (
          <form onSubmit={handleSubmit}>
            <Box css={styles.title()}>
              <Typography>Добавить ликвидность</Typography>
              <Button
                variant="text"
                size="small"
                endIcon={<WifiProtectedSetup />}
                disabled={isShouldDisabled}
                onClick={onClickChangeForm}
              >
                МОИ ПАРЫ
              </Button>
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
              max={shortBalance(maxFirstToken)}
              optionsValue={firstToken}
              handleMaxClick={handleMaxClick}
            />
            <Box css={styles.arrow()}>+</Box>
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
              max={shortBalance(maxSecondToken)}
              optionsValue={secondToken}
              isMaxBtnDisplayed
              handleMaxClick={handleMaxClick}
            />
            <Hint
              pair={currentPair}
              firstToken={firstToken}
              secondToken={secondToken}
              firstTokenValue={firstTokenValue}
              secondTokenValue={secondTokenValue}
              shouldReverse={shouldReverse}
              maxTokenIn={maxFirstToken}
              maxTokenOut={maxSecondToken}
              handelButtonDisabled={handelButtonDisabled}
            ></Hint>
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

export { AddLiquidityForm };
