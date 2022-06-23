import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (theme: Theme) => ({
  root: () => css``,
  alert: () => css`
    border-radius: ${theme.spacing(10)};
    box-shadow: ${theme.shadows[5]};
  `,
});

export { createStyles };
