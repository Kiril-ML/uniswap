import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (props: {}, theme: Theme) => ({
  root: () => css`
    font-size: ${theme.typography.pxToRem(40)};
    stroke: ${theme.palette.text.primary};
    stroke-width: ${theme.spacing(0.7)};
    color: transparent;

    @media (max-width: ${theme.breakpoints.values.sm}px) {
      height: ${theme.spacing(45)};
      width: ${theme.spacing(45)};
    }
  `,
});

export { createStyles };
