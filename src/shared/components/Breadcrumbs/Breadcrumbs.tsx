import { FC } from 'react';
import {
  BreadcrumbsProps as MUIBreadcrumbsProps,
  Breadcrumbs as MUIBreadcrumbs,
  useTheme,
} from '@mui/material';

import { Link, Props as LinkProps } from '../Link/Link';
import { createStyles } from './Breadcrumbs.style';

type Props = MUIBreadcrumbsProps & {
  items: (LinkProps & { isActive?: boolean })[];
};

const Breadcrumbs: FC<Props> = ({ items, ...MUIProps }) => {
  const theme = useTheme();
  const styles = createStyles({}, theme);

  return (
    <MUIBreadcrumbs css={styles.root()} {...MUIProps}>
      {items.map((itemProps) => {
        const { key, isActive, ...theRest } = itemProps;

        return <Link css={styles.item({ isActive })} key={key} {...theRest} />;
      })}
    </MUIBreadcrumbs>
  );
};

export type { Props };

export { Breadcrumbs };
