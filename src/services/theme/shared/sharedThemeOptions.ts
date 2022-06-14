import { ThemeOptions } from '@mui/material';

const sharedThemeOptions: ThemeOptions = {
  palette: { warning: { main: '#FEF402' } },
  typography: {
    h5: { lineHeight: 28.13 / 24, fontWeight: 500 },
    subtitle1: { lineHeight: 24 / 16 },
    button: {
      lineHeight: 16 / 14,
      letterSpacing: `${1.05 / 14}em`,
      fontWeight: 400,
    },
    caption: { lineHeight: 16 / 12 },
  },
};

export { sharedThemeOptions };
