/* eslint-disable*/
import { useTheme } from '@mui/material';
import { useEthers, useContractFunction } from '@usedapp/core';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { JsonRpcSigner } from '@ethersproject/providers';
import { Contract } from 'ethers';

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
import { BigNumber, parseUnits } from 'src/shared/helpers/blockchain/numbers';
import { calculateMinOut, calculateSwapOut } from 'src/features/Provider/utils';
import { contracts } from 'src/shared/api/blockchain/rinkeby/constants';
import { ERC20ABI } from 'src/shared/api/blockchain/constants';

import { selectProvider, swapIn } from '../../../../redux/slice';
import {
  FieldWithAutocomplete,
  Props as FieldWithAutocompleteProps,
} from '../../../components/FieldWithAutocomplete/FieldWithAutocomplete';
import { NumberInput } from '../../../components/NumberInput/NumberInput';
import { SubmitButtonValue } from '../types';
import { createStyles } from './SwapForm.style';
import { initialState, MAX_SLIPPAGE, MIN_SLIPPAGE } from './constants';
import { Hint } from './Hint/Hint';
import {
  calculateNeighborInputValue,
  getPairBalance,
  findCurrentPair,
  shortBalance,
  changeButtonText,
} from './utils';

type HandleAutocompleteChange =
  FieldWithAutocompleteProps['handleAutocompleteChange'];

type Props = {
  isLoading: boolean;
};

const SwapForm: FC<Props> = ({ isLoading }) => {
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
  const [activeTransaction, setActiveTransaction] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { account, library } = useEthers();

  let signer: JsonRpcSigner;

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

  const handleFirstTokenAutocompleteChange: HandleAutocompleteChange = (
    event,
    value
  ) => {
    if (value === null) {
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
    if (value === null) {
      setSecondToken(initialState.secondToken);
      setSecondTokenValue('');

      return;
    }

    setSecondToken(value);
  };

  const { shouldReverse, currentPair } = findCurrentPair({
    pairs: data.pairs,
    firstTokenName: firstToken.name,
    secondTokenName: secondToken.name,
  });

  const { registry, router } = contracts;
  const { address, ABI } = registry;
  const { address: routerAddress, ABI: routerABI } = router;

  const contract = new Contract(address, ABI, library);
  const contractERC20 = new Contract(firstToken.address, ERC20ABI, signer);
  const contractRouter = new Contract(routerAddress, routerABI, signer);
  const { state, send } = useContractFunction(contract, 'getPair');
  const { state: ERC20State, send: ERC20Send } = useContractFunction(
    contractERC20,
    'approve'
  );
  const { state: routerState, send: routerSend } = useContractFunction(
    contractRouter,
    'swapIn'
  );

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    send(
      '0x63706eDd35835972F46dd3EB09Ad4405d4e3A168',
      '0x781F8B032eFd365e56EC96564874937966Fb00e1'
    ).then(() =>
      ERC20Send(
        '0xBDb54E3B3e019E37eD741304960F0C68fb09F4E8',
        parseUnits(firstTokenValue, firstToken.decimals)
      ).then(() =>
        routerSend(
          firstToken.address,
          secondToken.address,
          parseUnits(firstTokenValue, firstToken.decimals),
          parseUnits(
            calculateMinOut({
              amountOut: secondTokenValue,
              slippage: Number(slippage),
              decimals: secondToken.decimals,
            }),
            secondToken.decimals
          )
        )
      )
    );

    // if (library !== undefined) {
    //   dispatch(
    //     swapIn({
    //       tokenInAddress: firstToken.address,
    // tokenInValue: parseUnits(firstTokenValue, firstToken.decimals),
    //       tokenOutAddress: secondToken.address,
    //       tokenOutMin: parseUnits(
    //         calculateMinOut({
    //           amountOut: secondTokenValue,
    //           slippage: Number(slippage),
    //           decimals: secondToken.decimals,
    //         }),
    //         secondToken.decimals
    //       ),
    //       provider: library,
    //       signer,
    //     })
    //   ).then(() => setActiveTransaction(false));

    //   setFirstTokenValue('');
    //   setSecondTokenValue('');

    //   setActiveTransaction(true);
    // }

    // console.log(data, 'data');
  };

  const [pairBalanceIn, pairBalanceOut] = getPairBalance({
    pair: currentPair,
    shouldReverse,
  });

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

    const {
      newNeighborValue,
      shouldUpdateNeighborValue,
      shouldResetNeighborValue,
    } = calculateNeighborInputValue({
      data,
      newValue: event.currentTarget.value,
      firstToken,
      pairBalanceIn,
      pairBalanceOut,
      secondToken,
      neighbor: 'second',
    });

    if (shouldUpdateNeighborValue) {
      setSecondTokenValue(newNeighborValue);
    } else if (shouldResetNeighborValue) {
      setSecondTokenValue('');
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

    const {
      newNeighborValue,
      shouldUpdateNeighborValue,
      shouldResetNeighborValue,
    } = calculateNeighborInputValue({
      data,
      newValue: event.currentTarget.value,
      firstToken,
      pairBalanceIn,
      pairBalanceOut,
      secondToken,
      neighbor: 'first',
    });

    if (shouldUpdateNeighborValue) {
      setFirstTokenValue(Number(newNeighborValue).toFixed(4));
    } else if (shouldResetNeighborValue) {
      setFirstTokenValue('');
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
  let maxTokenOut = '0';

  if (pairBalanceIn !== null && pairBalanceOut !== null) {
    maxTokenIn = BigNumber.min(
      firstToken.userBalance,
      pairBalanceIn
    ).toString();

    maxTokenOut = calculateSwapOut({
      amountIn: parseUnits(maxTokenIn, firstToken.decimals),
      balanceIn: parseUnits(pairBalanceIn, firstToken.decimals),
      balanceOut: parseUnits(pairBalanceOut, secondToken.decimals),
      fee: {
        amount: parseUnits(data.fee.value, data.fee.decimals),
        decimals: data.fee.decimals,
      },
      decimals: Math.max(firstToken.decimals, secondToken.decimals),
    });
  }

  const handelButtonDisabled = (shouldDisabledButton: boolean) => {
    setButtonDisabled(shouldDisabledButton);
  };

  const handleMaxClick = () => {
    const isTokensChosen = firstToken.name !== '' && secondToken.name !== '';

    if (isTokensChosen) {
      setFirstTokenValue(maxTokenIn);

      const { newNeighborValue } = calculateNeighborInputValue({
        data,
        newValue: maxTokenIn,
        firstToken,
        pairBalanceIn,
        pairBalanceOut,
        secondToken,
        neighbor: 'second',
      });

      setSecondTokenValue(newNeighborValue);
    }
  };

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
              max={shortBalance(maxTokenIn)}
              handleMaxClick={handleMaxClick}
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
              max={shortBalance(maxTokenOut)}
            />
            <Hint
              pair={currentPair}
              shouldReverse={shouldReverse}
              firstToken={firstToken}
              secondToken={secondToken}
              firstTokenValue={firstTokenValue}
              secondTokenValue={secondTokenValue}
              slippage={+slippage}
              maxTokenIn={maxTokenIn}
              maxTokenOut={maxTokenOut}
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
              disabled={isShouldDisabled || buttonDisabled}
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
