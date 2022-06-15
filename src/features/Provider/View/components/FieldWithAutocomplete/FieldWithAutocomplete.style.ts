import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createStyles = (theme: Theme) => ({
  root: () => css`
    display: flex;
  `,
  autocomplete: () => css``,
  inputAdornment: () =>
    css`
      min-width: ${theme.spacing(110)};
    `,
  input: () => css``,

  option: () => css``,
  optionAvatar: () =>
    css`
      flex: 0 1 35%;
    `,
  optionText: () => css``,
  caption: () => css`
    display: flex;
    flex-direction: column;
  `,
  captionBalance: () =>
    css`
      line-clamp: 1;
    `,
  addMaxBtn: () => css``,
});

export { createStyles };
