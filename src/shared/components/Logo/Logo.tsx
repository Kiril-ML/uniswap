import { useTheme } from '@mui/material';
import { FC } from 'react';

import { SVGIcon, Props as SVGIconProps } from '../Icon/SVGIcon/SVGIcon';
import SVG from './logo.svg';
import { createStyles } from './Logo.styles';

type Props = Omit<SVGIconProps, 'component'> & {};

const Logo: FC<Props> = (props) => {
  const theme = useTheme();
  const styles = createStyles({}, theme);

  return (
    <SVGIcon
      viewBox="0 0 14 15"
      css={styles.root()}
      component={SVG}
      {...props}
    ></SVGIcon>
  );
};

export type { Props };

export { Logo };
