import { useTheme } from '@mui/material';
import { useEthers } from '@usedapp/core';
import { Dispatch, FC, SetStateAction, useState } from 'react';

import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { selectProvider } from 'src/features/Provider/redux/selectors';
import { removeLiquidity } from 'src/features/Provider/redux/thunks';
import {
  Box,
  Button,
  Card,
  Typography,
  WifiProtectedSetup,
} from 'src/shared/components';
import { BigNumber } from 'src/shared/helpers/blockchain/numbers';

import { PairForm, Props as PairFormProps } from './PairForm/PairForm';
import { createStyles } from './RemoveLiquidityForm.style';

type HandleClickButton = PairFormProps['handleClickButton'];
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
  const dispatch = useAppDispatch();

  const [activeTransaction, setActiveTransaction] = useState(false);

  const userPairs = pairs.filter(
    (pair) => !new BigNumber(pair.userBalance).isZero()
  );

  const { account, library } = useEthers();
  const isShouldDisabled =
    account === undefined || isLoading || activeTransaction;

  const onClickChangeForm = () => {
    handleChangeForm('AddLiquidity');
  };

  const handleClickButton: HandleClickButton = ({
    token0Address,
    token1Address,
    amountLP,
  }) => {
    if (library !== undefined) {
      const signer = library.getSigner();
      dispatch(
        removeLiquidity({
          token0Address,
          token1Address,
          amountLP,
          signer,
        })
      ).then(() => setActiveTransaction(false));

      setActiveTransaction(true);
    }
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
                  <PairForm
                    key={pair.address}
                    pair={pair}
                    isShouldDisabled={isShouldDisabled}
                    handleClickButton={handleClickButton}
                  ></PairForm>
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
