import { useTheme } from '@mui/material';
import { FC, useState } from 'react';

import { Box } from 'src/shared/components';

import { AlertMessage } from '../../components/AlertMessage/AlertMessage';
import { SwapForm } from './SwapForm/SwapForm';
import { createStyles } from './Swap.style';

type Props = {
  isLoading: boolean;
};

const Swap: FC<Props> = ({ isLoading }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [showAlert, setShowAlert] = useState(false);

  const handleCloseAlertClick = () => {
    setShowAlert(false);
  };

  const handleShowAlertClick = () => {
    setShowAlert(true);
  };

  return (
    <Box css={styles.root()}>
      <AlertMessage
        message="обмен прошел успешно"
        show={showAlert}
        handleCloseClick={handleCloseAlertClick}
      ></AlertMessage>

      <SwapForm
        isLoading={isLoading}
        handleShowAlertClick={handleShowAlertClick}
        handleCloseAlertClick={handleCloseAlertClick}
      />
    </Box>
  );
};

export type { Props };

export { Swap };
