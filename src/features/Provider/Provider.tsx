/* eslint-disable multiline-comment-style */
import { FC, useEffect } from 'react';
import { useEthers, useToken, useTokenBalance } from '@usedapp/core';

import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { LinearProgress, Typography } from 'src/shared/components';
import { REQUEST_STATUS } from 'src/shared/helpers/redux';
import { contracts } from 'src/shared/api/blockchain/rinkeby/constants';

import { getData, selectProvider } from './redux/slice';
import { Swap } from './view/containers';

type Props = {
  view: 'Pools' | 'Swap';
};

const Provider: FC<Props> = ({ view }) => {
  const { status, shouldUpdateData, error } = useAppSelector(selectProvider);
  const dispatch = useAppDispatch();

  const { account, library } = useEthers();

  useEffect(() => {
    const isAuth = library !== undefined && account !== undefined;

    if (isAuth && shouldUpdateData) {
      dispatch(
        getData({
          userAddress: account,
          provider: library,
        })
      );
    }
  }, [dispatch, shouldUpdateData, library, account]);

  const { tokens } = contracts;
  const [firstToken, secondToken, thirdToken] = tokens;

  const firstTokenItem = {
    ...useToken(firstToken.address),
    image: firstToken.image,
    address: firstToken.address,
    balance: useTokenBalance(firstToken.address, account),
  };
  const secondTokenItem = {
    ...useToken(secondToken.address),
    image: secondToken.image,
    address: secondToken.address,
    balance: useTokenBalance(secondToken.address, account),
  };
  const thirdTokenItem = {
    ...useToken(thirdToken.address),
    image: thirdToken.image,
    address: thirdToken.address,
    balance: useTokenBalance(thirdToken.address, account),
  };

  const items = [firstTokenItem, secondTokenItem, thirdTokenItem];

  // console.log(items);

  switch (status) {
    case REQUEST_STATUS.idle:
    case REQUEST_STATUS.pending:
    case REQUEST_STATUS.fulfilled: {
      const isDisabled =
        status === REQUEST_STATUS.idle || status === REQUEST_STATUS.pending;
      const shouldDisplayProgress = status === REQUEST_STATUS.pending;

      switch (view) {
        case 'Swap': {
          return (
            <>
              {shouldDisplayProgress && <LinearProgress position="fixed-top" />}
              <Swap disabled={isDisabled} items={items} />
            </>
          );
        }
        default: {
          return null;
        }
      }
    }
    case REQUEST_STATUS.rejected: {
      return <Typography color="error">{error}</Typography>;
    }
    default: {
      return null;
    }
  }
};

export type { Props };

export { Provider };
