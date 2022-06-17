/* eslint-disable */
import { formatUnits } from '@ethersproject/units';
import { WifiProtectedSetup } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useEthers } from '@usedapp/core';
import {
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';

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
import { createStyles } from './AddLiquidityForm.style';

type HandleAutocompleteChange =
  FieldWithAutocompleteProps['handleAutocompleteChange'];

type Props = {
  items: Item[];
  handleChangeForm: Dispatch<
    SetStateAction<'RemoveLiquidity' | 'AddLiquidity'>
  >;
  hint?: ReactElement;
};

const AddLiquidityForm: FC<Props> = ({ hint, items, handleChangeForm }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [firstToken, setFirstToken] = useState('');
  const [firstTokenValue, setFirstTokenValue] = useState('');
  const [secondToken, setSecondToken] = useState('');
  const [secondTokenValue, setSecondTokenValue] = useState('');
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
      setSubmitButtonText('Добавить ликвидность');
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

  const onClickChangeForm = () => {
    handleChangeForm('RemoveLiquidity');
  };

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
              balance={findBalance(firstToken)}
              disabled={isShouldDisabled}
              handleAutocompleteChange={handleFirstTokenAutocompleteChange}
              options={items.filter((item) => item.name !== secondToken)}
              isMaxBtnDisplayed
            />
            <Box css={styles.arrow()}>+</Box>
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
