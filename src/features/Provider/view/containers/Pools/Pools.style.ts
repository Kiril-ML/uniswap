import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (theme: Theme) => ({
  root: () => css`
    display: flex;
    flex-direction: column;
    row-gap: ${theme.spacing(10)};
    @media (max-width: ${theme.breakpoints.values.sm}px) {
      width: 100%;
      padding: 0 ${theme.spacing(10)};
    }
  `,
});

export { createStyles };
