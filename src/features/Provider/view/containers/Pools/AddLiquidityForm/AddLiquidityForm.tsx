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
  FieldWithAutocompleteProps['onAutocompleteChange'];

type Props = {
  onChangeForm: Dispatch<SetStateAction<'RemoveLiquidity' | 'AddLiquidity'>>;
  isLoading: boolean;
  onShowAlert: () => void;
  onCloseAlert: () => void;
};

const AddLiquidityForm: FC<Props> = ({
  onChangeForm,
  isLoading,
  onShowAlert,
  onCloseAlert,
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
    useState<SubmitButtonValue>('???????????????????? ??????????????');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { account, library } = useEthers();

  let signer: ethers.providers.JsonRpcSigner | null = null;

  const isAuth = library !== undefined && account !== undefined;

  if (isAuth) {
    signer = library.getSigner();
  }

  const isShouldDisabled = account === undefined || isLoading;

  const shouldButtonDisabled =
    submitButtonText !== '???????????????? ??????????????????????' ||
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

  const handleChangeForm = () => {
    onChangeForm('RemoveLiquidity');
    onCloseAlert();
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
        onShowAlert();
        setActiveTransaction(false);
      });

      setFirstTokenValue('');
      setFirstToken(initialState.firstToken);
      setSecondToken(initialState.secondToken);
      setSecondTokenValue('');
      onCloseAlert();
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
              <Typography>???????????????? ??????????????????????</Typography>
              <Button
                variant="text"
                size="small"
                endIcon={<WifiProtectedSetup />}
                disabled={isShouldDisabled}
                onClick={handleChangeForm}
              >
                ?????? ????????
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
              onAutocompleteChange={handleFirstTokenAutocompleteChange}
              options={tokens.filter(
                (token) => token.name !== secondToken.name
              )}
              isMaxBtnDisplayed
              max={shortBalance(maxFirstToken)}
              optionsValue={firstToken}
              onMaxClick={handleMaxClick}
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
              onAutocompleteChange={handleSecondTokenAutocompleteChange}
              disabled={isShouldDisabled}
              max={shortBalance(maxSecondToken)}
              optionsValue={secondToken}
              isMaxBtnDisplayed
              onMaxClick={handleMaxClick}
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
              onDisabled={handelButtonDisabled}
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
