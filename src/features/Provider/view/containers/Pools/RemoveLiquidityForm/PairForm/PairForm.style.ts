import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (theme: Theme) => ({
  button: () => css`
    margin-top: ${theme.spacing(10)};
  `,
  pair: () => css`
    padding: ${theme.spacing(5)};
    border: ${theme.spacing(2)} solid ${theme.palette.grey[500]};
    margin-bottom: ${theme.spacing(12)};
    border-radius: ${theme.spacing(5)};
  `,
  pairTitle: () => css``,
  titleBox: () => css`
    display: flex;
    justify-content: space-between;
  `,
  balance: () => css`
    font-size: ${theme.spacing(14)};
  `,
  MaxBtnContainer: () => css`
    display: flex;
    justify-content: end;
  `,
  addMaxBtn: () => css``,
  input: () =>
    css`
      width: 100%;
    `,
});

export { createStyles };
