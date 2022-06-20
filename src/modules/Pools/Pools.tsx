import { useState } from 'react';
import { useTheme } from '@mui/material';

import { Header } from 'src/modules/shared/components';
import { DefaultLayout } from 'src/modules/shared/pageTemplates';
import type { NextPageWithLayout } from 'src/shared/types';
import { Box, PageHead, Typography } from 'src/shared/components';
import { Provider } from 'src/features/Provider';

import { createStyles } from './Pools.style';

const Pools: NextPageWithLayout = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [errorMessage, setErrorMessage] = useState('');

  const handleError = (er: string) => {
    setErrorMessage(er);
  };

  return (
    <>
      <PageHead title="Пулы ликвидности" />
      <DefaultLayout header={<Header handleError={handleError} />}>
        <Box css={styles.form()}>
          {errorMessage !== '' ? (
            <Typography color="error">{errorMessage}</Typography>
          ) : (
            <Provider view={'Pools'}></Provider>
          )}
        </Box>
      </DefaultLayout>
    </>
  );
};

Pools.getLayout = (page) => {
  return page;
};

export { Pools };
