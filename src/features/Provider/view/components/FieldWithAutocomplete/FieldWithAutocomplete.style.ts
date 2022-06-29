import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (theme: Theme) => ({
  root: () => css`
    display: flex;
  `,
  autocomplete: () => css``,
  inputAdornment: () =>
    css`
      min-width: ${theme.spacing(110)};
    `,
  input: () => css`
    @media (max-width: ${theme.breakpoints.values.sm}px) {
      margin-right: ${theme.spacing(160)};
    }
  `,

  option: () => css``,
  optionAvatar: () =>
    css`
      width: 35%;
    `,
  optionText: () =>
    css`
      width: 65%;
    `,
  caption: () => css`
    display: flex;
    flex-direction: column;
  `,
  captionBalance: () =>
    css`
      @media (max-width: ${theme.breakpoints.values.sm}px) {
        font-size: ${theme.spacing(16)};
      }
    `,
  addMaxBtn: () => css``,
  maxValueBox: () => css`
    position: relative;
  `,
  progress: () =>
    css`
      position: absolute;
      max-width: ${theme.typography.pxToRem(22)};
      max-height: ${theme.typography.pxToRem(22)};
    `,
});

export { createStyles };
