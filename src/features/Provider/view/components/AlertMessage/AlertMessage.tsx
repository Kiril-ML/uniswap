import { FC } from 'react';
import { useTheme } from '@mui/material';

import { Alert, Collapse, IconButton, CloseIcon } from 'src/shared/components';

import { createStyles } from './AlertMessage.style';

type Props = {
  message: string;
  show: boolean;
  handleCloseClick: () => void;
};

const AlertMessage: FC<Props> = ({
  message = 'test',
  show,
  handleCloseClick,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Collapse in={show}>
      <Alert
        css={styles.alert()}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleCloseClick}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Collapse>
  );
};

export type { Props };

export { AlertMessage };
