import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (props: {}, theme: Theme) => ({
  root: () => css`
    position: relative;
  `,
  auth: () =>
    css`
      padding: ${theme.spacing(10)};
      @media (max-width: ${theme.breakpoints.values.sm}px) {
        width: 100%;
        max-width: ${theme.spacing(500)};
      }
    `,
  walletBox: () => css`
    display: flex;
    flex-direction: column;
  `,
  accountBox: () => css`
    display: flex;
    align-items: center;
    column-gap: ${theme.spacing(10)};
  `,
  balanceBox: () => css``,
  wallet: () => css`
    min-height: ${theme.spacing(70)};
    display: flex;
    align-items: center;
  `,
});

export { createStyles };
