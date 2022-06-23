import { useTheme } from '@mui/material';
import { ethers } from 'ethers';
import { FC, SyntheticEvent, useState } from 'react';

import { Pair } from 'src/features/Provider/types';
import { shortBalance } from 'src/features/Provider/utils';
import { NumberInput } from 'src/features/Provider/view/components/NumberInput/NumberInput';
import { Address } from 'src/shared/api/blockchain/types';
import { Box, Button, Typography } from 'src/shared/components';
import { parseUnits } from 'src/shared/helpers/blockchain/numbers';

import { createStyles } from './PairForm.style';

type Props = {
  pair: Pair;
  isShouldDisabled: boolean;
  handleClickButton: ({
    token0Address,
    token1Address,
    amountLP,
  }: {
    token0Address: Address;
    token1Address: Address;
    amountLP: ethers.BigNumber;
  }) => void;
};

const PairForm: FC<Props> = ({ isShouldDisabled, pair, handleClickButton }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [value, setValue] = useState('');

  const onClick = () => {
    handleClickButton({
      token0Address: pair.tokens[0].address,
      token1Address: pair.tokens[1].address,
      amountLP: parseUnits(value, pair.decimals),
    });

    setValue('');
  };

  const handleMaxClick = () => {
    setValue(pair.userBalance);
  };

  const handleValueChange = (
    event: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.currentTarget.value;

    if (+newValue <= +pair.userBalance) {
      setValue(newValue);
    }
  };

  return (
    <Box
      css={styles.pair()}
      key={pair.tokens.map(({ symbol }) => symbol).toString()}
    >
      <Box css={styles.titleBox()}>
        <Typography css={styles.pairTitle()}>
          {`Пара: ${pair.tokens.map(({ symbol }) => symbol).join(' + ')}`}
        </Typography>
        <Typography css={styles.balance()}>{`баланс ${
          pair.pairSymbol
        }: ${shortBalance(pair.userBalance)}`}</Typography>
      </Box>
      <Box css={styles.MaxBtnContainer()}>
        <Button
          css={styles.addMaxBtn()}
          type="button"
          size="small"
          color="secondary"
          disabled={isShouldDisabled}
          onClick={handleMaxClick}
        >
          макс
        </Button>
      </Box>
      <NumberInput
        variant="filled"
        css={styles.input()}
        InputProps={{
          value,
          onChange: handleValueChange,
          disableUnderline: true,
          disabled: isShouldDisabled,
        }}
      ></NumberInput>

      <Button
        type="submit"
        css={styles.button()}
        variant="contained"
        fullWidth
        disabled={isShouldDisabled}
        onClick={onClick}
      >
        ВЫВЕСТИ
      </Button>
    </Box>
  );
};

export type { Props };

export { PairForm };
