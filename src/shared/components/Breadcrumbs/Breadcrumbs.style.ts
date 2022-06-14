import { css, alpha } from '@mui/material';

import { Theme } from 'src/shared/styles/theme';

const createStyles = (props: {}, theme: Theme) => ({
  root: () => css`
    padding: ${theme.spacing(8)} ${theme.spacing(5)};
    border-radius: ${theme.spacing(15)};
    background: ${theme.palette.background.paper};
  `,
  item: (itemProps: { isActive?: boolean }) => {
    const isActive = itemProps.isActive
      ? css`
          color: ${alpha(theme.palette.common.black, 1)};
          background: ${theme.palette.grey[300]};
          border-radius: ${theme.spacing(16)};
        `
      : css`
          color: ${alpha(theme.palette.common.black, 0.7)};
        `;

    return css`
      font-size: ${theme.typography.button.fontSize};
      font-weight: ${theme.typography.button.fontWeight};
      word-break: break-word;
      overflow: hidden;
      white-space: nowrap;
      padding: ${theme.spacing(4)} ${theme.spacing(8)};

      ${isActive}

      &:hover {
        color: ${alpha(theme.palette.common.black, 1)};
      }
    `;
  },
});

export { createStyles };