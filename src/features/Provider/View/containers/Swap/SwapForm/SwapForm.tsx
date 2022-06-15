/* eslint-disable multiline-comment-style */

import { formatUnits } from '@ethersproject/units';
import { useTheme } from '@mui/material';
import { useEthers } from '@usedapp/core';
import { FC, ReactElement, SyntheticEvent, useEffect, useState } from 'react';

import { Item } from 'src/features/Provider/types';
import {
  Box,
  Button,
  Card,
  Typography,
  InputAdornment,
  ArrowDown,
} from 'src/shared/components';

import {
  FieldWithAutocomplete,
  Props as FieldWithAutocompleteProps,
} from '../../../components/FieldWithAutocomplete/FieldWithAutocomplete';
import { NumberInput } from '../../../components/NumberInput/NumberInput';
import { SubmitButtonValue } from '../types';
import { createStyles } from './SwapForm.style';

type HandleAutocompleteChange =
  FieldWithAutocompleteProps['handleAutocompleteChange'];

type Props = {
  items: Item[];
  hint?: ReactElement;
};

const SwapForm: FC<Props> = ({ hint, items }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [firstToken, setFirstToken] = useState('');
  const [firstTokenValue, setFirstTokenValue] = useState('');
  const [secondToken, setSecondToken] = useState('');
  const [secondTokenValue, setSecondTokenValue] = useState('');
  const [slippage, setSlippage] = useState('');
  const [submitButtonText, setSubmitButtonText] =
    useState<SubmitButtonValue>('Подключите кошелек');

  const { account } = useEthers();
  const isShouldDisabled = account === undefined;

  useEffect(() => {
    if (firstToken === '' || secondToken === '') {
      setSubmitButtonText('Выберите токены');
    }

    if (
      firstToken !== '' &&
      secondToken !== '' &&
      (firstTokenValue === '' || secondTokenValue === '')
    ) {
      setSubmitButtonText('Укажите количество');
    }

    if (
      firstToken !== '' &&
      secondToken !== '' &&
      firstTokenValue !== '' &&
      secondTokenValue !== ''
    ) {
      setSubmitButtonText('Обменять');
    }

    if (isShouldDisabled) {
      setSubmitButtonText('Подключите кошелек');
    }
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
      console.log(value);

      setFirstToken('');

      return;
    }

    setFirstToken(value.name);
  };

  const handleSecondTokenAutocompleteChange: HandleAutocompleteChange = (
    event,
    value
  ) => {
    if (value === null) {
      setSecondToken('');

      return;
    }

    setSecondToken(value.name);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // onSubmit(data);
  };

  const findBalance = (tokenName: string) => {
    if (tokenName === '') return null;
    const currentItem = items.filter((item) => item.name === tokenName);

    if (
      currentItem.length === 0 ||
      currentItem[0].balance === undefined ||
      currentItem[0].decimals === undefined
    ) {
      return null;
    }

    return Number(
      formatUnits(currentItem[0].balance, currentItem[0].decimals)
    ).toFixed(4);
  };

  const handleFirstTokenValueChange = (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    setFirstTokenValue(event.currentTarget.value);
  };

  const handleSecondTokenValueChange = (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    setSecondTokenValue(event.currentTarget.value);
  };

  const handleSlippageChange = (
    event: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSlippage(event.currentTarget.value);
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
              balance={findBalance(firstToken)}
              disabled={isShouldDisabled}
              handleAutocompleteChange={handleFirstTokenAutocompleteChange}
              options={items.filter((item) => item.name !== secondToken)}
              isMaxBtnDisplayed
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
              balance={findBalance(secondToken)}
              options={items.filter((item) => item.name !== firstToken)}
              handleAutocompleteChange={handleSecondTokenAutocompleteChange}
              disabled={isShouldDisabled}
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
