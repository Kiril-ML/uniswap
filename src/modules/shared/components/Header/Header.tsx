import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress, useTheme } from '@mui/material';
import {
  useEthers,
  useEtherBalance,
  Rinkeby,
  shortenAddress,
} from '@usedapp/core';
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

  const { activateBrowserWallet, account, deactivate, chainId, error } =
    useEthers();
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
      handleError('Пожалуйста, выберите сеть Rinkeby');

      return;
    }

    if (error !== undefined) {
      handleError(error.message);
    }

    handleError('');
  }, [chainId, error, handleError]);

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
      css={styles.root()}
      navigation={navigation}
      userWallet={
        <Box css={styles.wallet()}>
          {account ? (
            <Box css={styles.walletBox()}>
              <Box css={styles.accountBox()}>
                <Typography>Адрес: {shortenAddress(account)}</Typography>
                <IconButton onClick={handleLogoutClick}>
                  <Logout></Logout>
                </IconButton>
              </Box>
              <Box css={styles.balanceBox()}>
                <Typography>
                  Баланс ETH:{' '}
                  {etherBalance ? (
                    Number(formatEther(etherBalance)).toFixed(3)
                  ) : (
                    <CircularProgress
                      style={{ maxWidth: '12px', maxHeight: '12px' }}
                    />
                  )}
                </Typography>
              </Box>
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
        </Box>
      }
    />
  );
};

export type { Props };

export { Header };
