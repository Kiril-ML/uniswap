import { WifiProtectedSetup } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { useEthers } from '@usedapp/core';
import { Dispatch, FC, SetStateAction } from 'react';

import { Pair } from 'src/features/Provider/types';
import { Box, Button, Card, Typography } from 'src/shared/components';

import { NumberInput } from '../../../components/NumberInput/NumberInput';
import { createStyles } from './RemoveLiquidityForm.style';

type Props = {
  pairs: Pair[];
  handleChangeForm: Dispatch<
    SetStateAction<'RemoveLiquidity' | 'AddLiquidity'>
  >;
};

const RemoveLiquidityForm: FC<Props> = ({ pairs = [], handleChangeForm }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { account } = useEthers();
  const isShouldDisabled = account === undefined;

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
                // disabled={switchBtn.disabled}
                onClick={onClickChangeForm}
              >
                ДОБАВИТЬ ПАРУ
              </Button>
            </Box>
            <Box>
              {pairs.length === 0 ? (
                <Typography align="center">У вас пока нет пар</Typography>
              ) : (
                pairs.map((pair) => (
                  <Box
                    css={styles.pair()}
                    key={pair.tokens.map(({ name }) => name).toString()}
                  >
                    <Typography css={styles.pairTitle()}>
                      {`${pair.tokens.map(({ name }) => name).join(' + ')}:`}
                    </Typography>
                    <NumberInput
                      InputProps={{
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
