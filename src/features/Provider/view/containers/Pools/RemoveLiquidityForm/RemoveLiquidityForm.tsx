import { useTheme } from '@mui/material';
import { useEthers } from '@usedapp/core';
import { Dispatch, FC, SetStateAction, useState } from 'react';

import { useAppSelector } from 'src/app/hooks';
import { selectProvider } from 'src/features/Provider/redux/selectors';
import {
  Box,
  Button,
  Card,
  Typography,
  WifiProtectedSetup,
} from 'src/shared/components';
import { BigNumber } from 'src/shared/helpers/blockchain/numbers';

import { NumberInput } from '../../../components/NumberInput/NumberInput';
import { createStyles } from './RemoveLiquidityForm.style';

type Props = {
  isLoading: boolean;
  handleChangeForm: Dispatch<
    SetStateAction<'RemoveLiquidity' | 'AddLiquidity'>
  >;
};

const RemoveLiquidityForm: FC<Props> = ({ isLoading, handleChangeForm }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { data } = useAppSelector(selectProvider);
  const { pairs } = data;

  const [activeTransaction, setActiveTransaction] = useState(false);

  const userPairs = pairs.filter(
    (pair) => !new BigNumber(pair.userBalance).isZero()
  );

  // console.log(userPairs, 'userPairs');
  // console.log(pairs, 'pairs');

  const { account } = useEthers();
  const isShouldDisabled =
    account === undefined || isLoading || activeTransaction;

  const onClickChangeForm = () => {
    handleChangeForm('AddLiquidity');
  };

  return (
    <Card
      css={styles.root()}
      content={{
        children: (
          <>
            <Box css={styles.title()}>
              <Typography>Мои пары</Typography>
              <Button
                variant="text"
                size="small"
                endIcon={<WifiProtectedSetup />}
                disabled={isShouldDisabled}
                onClick={onClickChangeForm}
              >
                ДОБАВИТЬ ПАРУ
              </Button>
            </Box>
            <Box>
              {userPairs.length === 0 ? (
                <Typography align="center">У вас пока нет пар</Typography>
              ) : (
                userPairs.map((pair) => (
                  <Box
                    css={styles.pair()}
                    key={pair.tokens.map(({ symbol }) => symbol).toString()}
                  >
                    <Typography css={styles.pairTitle()}>
                      {`${pair.tokens.map(({ symbol }) => symbol).join(' + ')}`}
                    </Typography>
                    <NumberInput
                      inputProps={{
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
                    >
                      ВЫВЕСТИ
                    </Button>
                  </Box>
                ))
              )}
            </Box>
          </>
        ),
      }}
    ></Card>
  );
};

export type { Props };

export { RemoveLiquidityForm };
