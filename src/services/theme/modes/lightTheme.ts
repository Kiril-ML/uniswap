import { createTheme } from '@mui/material';

import { lightTheme as sharedLightTheme } from 'src/shared/styles/theme';

import { sharedThemeOptions } from '../shared';

const lightTheme = createTheme(sharedLightTheme, sharedThemeOptions, {
  palette: { primary: { main: '#2f80ed' } },
});

export { lightTheme };
