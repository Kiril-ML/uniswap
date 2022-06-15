import { useState } from 'react';
import { useTheme } from '@mui/material';
// import { Rinkeby, useEtherBalance, useEthers } from '@usedapp/core';

import { Header } from 'src/modules/shared/components';
// import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { DefaultLayout } from 'src/modules/shared/pageTemplates';
import type { NextPageWithLayout } from 'src/shared/types';
import { Box, PageHead, Typography } from 'src/shared/components';
import { Provider } from 'src/features/Provider';

import { createStyles } from './Home.style';

const Home: NextPageWithLayout = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // const dispatch = useAppDispatch();

  const [errorMessage, setErrorMessage] = useState('');

  const handleError = (er: string) => {
    setErrorMessage(er);
  };

  return (
    <>
      <PageHead title="Uniswap - clone" />
      <DefaultLayout header={<Header handleError={handleError} />}>
        <Box css={styles.form()}>
          {errorMessage !== '' ? (
            <Typography color="error">{errorMessage}</Typography>
          ) : (
            <Provider view={'Swap'}></Provider>
          )}
        </Box>
      </DefaultLayout>
    </>
  );
};

Home.getLayout = (page) => {
  return page;
};

export { Home };
