import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (theme: Theme) => ({
  root: () => css`
    width: ${theme.spacing(400)};
    border-radius: ${theme.spacing(24)};
    background: ${theme.palette.background.paper};
    box-shadow: ${theme.shadows[13]};
  `,
  title: () => css`
    display: flex;
    justify-content: space-between;
  `,
  button: () => css`
    margin-top: ${theme.spacing(10)};
  `,
  pair: () => css``,
  pairTitle: () => css``,
});

export { createStyles };
