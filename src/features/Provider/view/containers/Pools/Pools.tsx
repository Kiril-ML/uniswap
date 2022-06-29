import { FC, useState } from 'react';
import { useTheme } from '@mui/material';

import { Box } from 'src/shared/components';

import { AddLiquidityForm } from './AddLiquidityForm/AddLiquidityForm';
import { RemoveLiquidityForm } from './RemoveLiquidityForm/RemoveLiquidityForm';
import { createStyles } from './Pools.style';
import { AlertMessage } from '../../components/AlertMessage/AlertMessage';

type Props = {
  isLoading: boolean;
};

const Pools: FC<Props> = ({ isLoading }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [formType, setFormType] = useState<'AddLiquidity' | 'RemoveLiquidity'>(
    'AddLiquidity'
  );
  const [showAlert, setShowAlert] = useState(false);

  const handleCloseAlertClick = () => {
    setShowAlert(false);
  };

  const handleShowAlertClick = () => {
    setShowAlert(true);
  };

  return formType === 'AddLiquidity' ? (
    <Box css={styles.root()}>
      <AlertMessage
        message="ликвидность добавлена успешно"
        show={showAlert}
        oneClose={handleCloseAlertClick}
      ></AlertMessage>
      <AddLiquidityForm
        onShowAlert={handleShowAlertClick}
        isLoading={isLoading}
        onCloseAlert={handleCloseAlertClick}
        onChangeForm={setFormType}
      />
    </Box>
  ) : (
    <Box css={styles.root()}>
      <AlertMessage
        message="ликвидность выведена успешно"
        show={showAlert}
        oneClose={handleCloseAlertClick}
      ></AlertMessage>
      <RemoveLiquidityForm
        onChangeForm={setFormType}
        isLoading={isLoading}
        onCloseAlert={handleCloseAlertClick}
        onShowAlert={handleShowAlertClick}
      ></RemoveLiquidityForm>
    </Box>
  );
};

export type { Props };

export { Pools };
