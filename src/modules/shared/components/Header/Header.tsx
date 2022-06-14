/* eslint-disable multiline-comment-style */
import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from '@mui/material';
import { useEthers, useEtherBalance, Rinkeby } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';

import {
  Box,
  Button,
  Header as HeaderComponent,
  IconButton,
  Logout,
  Typography,
} from 'src/shared/components';

import { items } from './constants';
import { createStyles } from './Header.style';

type Props = {
  handleError: (error: string) => void;
};

declare global {
  interface Window {
    ethereum: any;
  }
}

const Header: FC<Props> = ({ handleError }) => {
  const theme = useTheme();
  const styles = createStyles({}, theme);

  const { activateBrowserWallet, account, deactivate, chainId } = useEthers();
  const etherBalance = useEtherBalance(account);

  const { pathname } = useRouter();
  const navigation = {
    items: items.map((item) => {
      const { key, title, href } = item;
      const isCurrentPage =
        href === '/' ? pathname === href : pathname.startsWith(href);

      return {
        key,
        children: title,
        href,
        isCurrentPage,
        'aria-label': item['aria-label'],
      };
    }),
  };

  useEffect(() => {
    if (chainId !== Rinkeby.chainId) {
      handleError('Пожалуйста, Выберите сеть rinkeby');

      return;
    }

    handleError('');
  }, [chainId, handleError]);

  const handleAuthClick = () => {
    activateBrowserWallet();

    if (chainId !== Rinkeby.chainId) {
      handleError('Пожалуйста, Выберите сеть rinkeby');

      return;
    }

    if (window?.ethereum === undefined) {
      handleError('Пожалуйста, установите MetaMask');

      return;
    }

    handleError('');
  };

  const handleLogoutClick = () => {
    deactivate();
  };

  return (
    <HeaderComponent
      navigation={navigation}
      userWallet={
        <>
          {account ? (
            <Box css={styles.walletInfo()}>
              <Typography>
                {`${account.slice(0, 5)}..${account.slice(-3)}`}
              </Typography>
              <Typography>
                ETH:{' '}
                {etherBalance
                  ? Number(formatEther(etherBalance)).toFixed(3)
                  : 'undefined'}
              </Typography>
              <IconButton onClick={handleLogoutClick}>
                <Logout></Logout>
              </IconButton>
            </Box>
          ) : (
            <Button
              css={styles.auth()}
              variant="contained"
              size="small"
              color="secondary"
              borderRadius="rounded"
              onClick={handleAuthClick}
            >
              Подключить кошелек
            </Button>
          )}
        </>
      }
    />
  );
};

export type { Props };

export { Header };
