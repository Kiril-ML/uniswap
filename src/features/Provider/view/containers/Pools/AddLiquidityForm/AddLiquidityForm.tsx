import { WifiProtectedSetup } from '@mui/icons-material';
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
import { Token } from 'src/features/Provider/types';
import {
  findCurrentPair,
  getPairBalance,
  shortBalance,
} from 'src/features/Provider/utils';
import { Box, Card } from 'src/shared/components';
import { BigNumber } from 'src/shared/helpers/blockchain/numbers';

import {
  FieldWithAutocomplete,
  Props as FieldWithAutocompleteProps,
} from '../../../components/FieldWithAutocomplete/FieldWithAutocomplete';
import { initialState } from '../../Swap/SwapForm/constants';
import { createStyles } from './AddLiquidityForm.style';
import { SubmitButtonValue } from './types';
import { changeButtonText } from './utils/changeButtonText';

type HandleAutocompleteChange =
  FieldWithAutocompleteProps['handleAutocompleteChange'];

type Props = {
  handleChangeForm: Dispatch<
    SetStateAction<'RemoveLiquidity' | 'AddLiquidity'>
  >;
  isLoading: boolean;
};

const AddLiquidityForm: FC<Props> = ({ handleChangeForm, isLoading }) => {
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

  const { account, library } = useEthers();

  let signer: ethers.providers.JsonRpcSigner | null = null;

  const isAuth = library !== undefined && account !== undefined;

  if (isAuth) {
    signer = library.getSigner();
  }

  const isShouldDisabled =
    account === undefined || isLoading || activeTransaction;

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

  const onClickChangeForm = () => {
    handleChangeForm('RemoveLiquidity');
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
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

    // const {
    //   newNeighborValue,
    //   shouldUpdateNeighborValue,
    //   shouldResetNeighborValue,
    // } = calculateNeighborInputValue({
    //   data,
    //   newValue: event.currentTarget.value,
    //   firstToken,
    //   pairBalanceIn,
    //   pairBalanceOut,
    //   secondToken,
    //   neighbor: 'second',
    // });

    // if (shouldUpdateNeighborValue) {
    //   setSecondTokenValue(newNeighborValue);
    // } else if (shouldResetNeighborValue) {
    //   setSecondTokenValue('');
    // }
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

    // const {
    //   newNeighborValue,
    //   shouldUpdateNeighborValue,
    //   shouldResetNeighborValue,
    // } = calculateNeighborInputValue({
    //   data,
    //   newValue: event.currentTarget.value,
    //   firstToken,
    //   pairBalanceIn,
    //   pairBalanceOut,
    //   secondToken,
    //   neighbor: 'first',
    // });

    // if (shouldUpdateNeighborValue) {
    //   setFirstTokenValue(Number(newNeighborValue).toFixed(4));
    // } else if (shouldResetNeighborValue) {
    //   setFirstTokenValue('');
    // }
  };

  switch (currentPair?.proportion) {
    case 'any': {
      console.log('пропорция любая');

      break;
    }
    case '': {
      console.log('');

      break;
    }
    default: {
      console.log(
        `пропорция: ${new BigNumber(currentPair?.proportion)
          .decimalPlaces(5)
          .toString()}`
      );

      break;
    }
  }

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
                // disabled={switchBtn.disabled}
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
              max={''}
              optionsValue={firstToken}
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
              max={''}
              optionsValue={secondToken}
            />

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

export { AddLiquidityForm };
