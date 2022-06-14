import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (props: {}, theme: Theme) => ({
  root: () => css``,
  auth: () =>
    css`
      padding: ${theme.spacing(10)};
    `,
  walletInfo: () => css`
    display: flex;
    column-gap: ${theme.spacing(10)};
    align-items: center;
  `,
  balance: () => css``,
  address: () => css``,
});

export { createStyles };
