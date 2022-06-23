import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (theme: Theme) => ({
  root: () => css`
    display: flex;
    flex-direction: column;
    row-gap: ${theme.spacing(10)};
  `,

  insufficientAmount: () => css``,
  proportion: () => css``,
  commission: () => css``,
  slippage: () => css``,
});

export { createStyles };
