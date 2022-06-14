import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (theme: Theme) => ({
  root: () => css`
    height: 100%;
    min-height: 100%;
    margin: 0 auto;
  `,
  form: () => css`
    display: flex;
    justify-content: center;
  `,
  grid: () => css`
    display: grid;
    grid-template-rows: 1fr 1.77fr 1.52fr;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      '. . . . .'
      'left-file . arrow . right-file'
      '. sync-message sync-message sync-message .';
    align-items: center;
    min-height: 100%;
    height: 100%;

    @media print, screen and (min-width: ${theme.breakpoints.values.xl}px) {
      grid-template-rows: 0.5fr 3.54fr 1.52fr;
      grid-template-areas:
        '. . . . .'
        'left-file . arrow . right-file'
        'sync-message sync-message sync-message sync-message sync-message';
    }
  `,
  leftFile: () => css`
    grid-area: left-file;
    justify-self: center;
    max-width: 100%;
    margin-top: 46%;
  `,
  arrow: () => css`
    grid-area: arrow;
  `,
  rightFile: () => css`
    grid-area: right-file;
    justify-self: center;
    max-width: 100%;
    margin-top: 46%;
  `,
  syncMessage: () => css`
    grid-area: sync-message;
    align-self: flex-end;

    @media print, screen and (min-width: ${theme.breakpoints.values.xl}px) {
      margin-top: 4%;
    }
  `,
});

export { createStyles };
