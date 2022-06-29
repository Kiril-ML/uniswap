import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (props: {}, theme: Theme) => ({
  root: () => css`
    color: ${theme.palette.common.black};
    padding: ${theme.spacing(20)} ${theme.spacing(15)};
    background: none;
    box-shadow: ${theme.shadows[0]};
  `,
  toolbar: () => css`
    display: grid;
    grid-template-columns: ${theme.spacing(240)} 1fr ${theme.spacing(240)};
    grid-template-areas: 'logo navigation wallet';

    @media (max-width: ${theme.breakpoints.values.sm}px) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-areas:
        'logo'
        'navigation'
        'wallet';
      justify-items: center;
      row-gap: ${theme.spacing(2)};
    }
  `,
  logo: () => css`
    grid-area: logo;
  `,
  userWallet: () => css`
    grid-area: wallet;
    @media (max-width: ${theme.breakpoints.values.sm}px) {
      display: flex;
      width: 100%;
      justify-content: center;
    }
  `,
  navigation: () => css`
    grid-area: navigation;
    justify-self: center;
  `,
});

export { createStyles };
