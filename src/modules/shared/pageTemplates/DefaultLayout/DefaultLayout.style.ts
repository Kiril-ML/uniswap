import { css } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

import type { Props } from './DefaultLayout';

const createStyles = (props: Pick<Props, 'header'>, theme: Theme) => ({
  root: () => {
    const layout = css`
      grid:
        ${props.header && "'header' auto"}
        'content' 1fr / auto;
    `;

    return css`
      display: grid;
      min-height: 100%;
      overflow: hidden;
      background: ${theme.palette.common.uniswapColor};
      ${layout}
    `;
  },
  header: () => {
    return css`
      grid-area: header;
    `;
  },
  content: () => {
    return css`
      grid-area: content;
      padding-top: ${theme.spacing(10)};
      padding-bottom: ${theme.spacing(10)};
    `;
  },
});

export { createStyles };
