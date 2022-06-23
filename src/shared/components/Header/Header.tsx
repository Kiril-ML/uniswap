import { FC, ReactElement } from 'react';
import {
  AppBarProps as MUIHeaderProps,
  AppBar as MUIHeader,
  Toolbar as MUIToolbar,
  useTheme,
} from '@mui/material';

import { Box } from '../Box/Box';
import { Navigation, Props as NavigationProps } from './Navigation/Navigation';
import { createStyles } from './Header.style';
import { defaultNavigationItems } from './constants';
import { Link } from '../Link/Link';
import { Logo } from '../Logo/Logo';

type Props = MUIHeaderProps & {
  userWallet?: ReactElement;
  navigation?: NavigationProps;
};

const Header: FC<Props> = ({
  navigation = { items: defaultNavigationItems },
  userWallet = null,
  ...MUIProps
}) => {
  const theme = useTheme();
  const styles = createStyles({}, theme);

  return (
    <MUIHeader css={styles.root()} {...MUIProps}>
      <MUIToolbar css={styles.toolbar()} variant="dense" disableGutters>
        <Link href="/" css={styles.logo()} underline="none">
          <Logo></Logo>
        </Link>
        <Box css={styles.navigation()}>
          <Navigation {...navigation} />
        </Box>
        <Box css={styles.userWallet()}>{userWallet}</Box>
      </MUIToolbar>
    </MUIHeader>
  );
};

export type { Props };

export { Header };
