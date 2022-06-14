import { FC } from 'react';

import { Props as LinkProps } from '../../Link/Link';
import { Breadcrumbs } from '../../Breadcrumbs/Breadcrumbs';
import { NavigationItem } from '../types';

type Props = {
  items: NavigationItem[];
};

const Navigation: FC<Props> = ({ items }) => {
  const breadcrumbsItems: LinkProps[] = items.map((item) => {
    const { isCurrentPage, ...theRest } = item;

    const ariaCurrent = isCurrentPage && 'page';

    return {
      isActive: isCurrentPage,
      underline: 'none',
      'aria-current': ariaCurrent,
      ...theRest,
    };
  });

  return (
    <>
      <Breadcrumbs
        separator=""
        aria-label="хлебные крошки"
        items={breadcrumbsItems}
      />
    </>
  );
};

export type { Props };

export { Navigation };
