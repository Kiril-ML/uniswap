import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (theme: Theme) => ({
  root: () =>
    css`
      margin: ${theme.spacing(10)} 0;
    `,
  caption: () => css`
    font-size: ${theme.typography.pxToRem(12)};
    color: ${theme.palette.grey[600]};
  `,
  insufficientAmount: () => css`
    font-size: ${theme.typography.pxToRem(16)};
    color: ${theme.palette.error.main};
  `,
});

export { createStyles };
