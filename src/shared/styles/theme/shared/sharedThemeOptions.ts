import { CSSProperties } from 'react';
import { ThemeOptions } from '@mui/material';

import { ROOT_FONT_SIZE } from 'src/shared/styles/base/constants';

declare module '@mui/material' {
  interface Color {
    20: string;
    70: string;
    258: string;
    351: string;
    693: string;
    984: string;
    924: string;
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    cursor: {
      grab: CSSProperties['cursor'];
      grabbing: CSSProperties['cursor'];
    };
  }
  interface ThemeOptions {
    cursor?: {
      grab?: CSSProperties['cursor'];
      grabbing?: CSSProperties['cursor'];
    };
  }
}

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    midnight: CSSProperties['color'];
    linkWater: CSSProperties['color'];
    uniswapColor: CSSProperties['color'];
  }
}

const sharedThemeOptions: ThemeOptions = {
  palette: {
    grey: {
      20: '#f2f2f2',
      70: '#f7f7f7',
      258: '#e8e8e8',
      351: '#cfd4da',
      693: '#707070',
      984: '#050504',
      924: '#191919',
    },
    common: {
      midnight: '#001B45',
      linkWater: '#d8e1f3',
      uniswapColor: '#f7f8fa',
    },
  },

  spacing: (
    top?: number | string,
    right?: number | string,
    bottom?: number | string,
    left?: number | string
  ) =>
    [top, right, bottom, left]
      .map((factor) =>
        typeof factor === 'number' ? `${factor / ROOT_FONT_SIZE}rem` : factor
      )
      .join(' '),
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: false,
      },
    },
  },
  cursor: { grab: 'grab', grabbing: 'grabbing' },
};

export { sharedThemeOptions };
