import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

type BreakpointOrNull = Breakpoint | null;

/**
 * Будь аккуратен при использовании: это работает только когда breakpoints в теме не изменялись - это сломается если количество breakpoints отлично от базовых
 * Подробнее - https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
 */
const useWidth = (): Breakpoint => {
  const theme = useTheme();
  const keys: readonly Breakpoint[] = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      const resultExists = output !== null;

      if (!resultExists && matches) {
        return key;
      }

      return output;
    }, null) || 'xs'
  );
};

export { useWidth };
