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
    grid-template-columns: ${theme.spacing(230)} 1fr ${theme.spacing(230)};
  `,
  logo: () => css``,
  userWallet: () => css`
    line-height: ${theme.typography.pxToRem(26)};
    font-weight: ${theme.typography.h5.fontWeight};
  `,
  navigation: () => css`
    justify-self: center;
  `,
});

export { createStyles };
