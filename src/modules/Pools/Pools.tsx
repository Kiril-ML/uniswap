import { useState, useRef } from 'react';
import { useTheme } from '@mui/material';

import { Header } from 'src/modules/shared/components';
import { useAppDispatch } from 'src/app/hooks';
import { DefaultLayout } from 'src/modules/shared/pageTemplates';
import type { NextPageWithLayout } from 'src/shared/types';
import { PageHead } from 'src/shared/components';

import { createStyles } from './Pools.style';

const Pools: NextPageWithLayout = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <PageHead title="Пулы ликвидности" />
      <DefaultLayout header={<Header />}></DefaultLayout>
    </>
  );
};

Pools.getLayout = (page) => {
  return page;
};

export { Pools };
