import { FC, useEffect } from 'react';
import { useEthers } from '@usedapp/core';

import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { LinearProgress, Typography } from 'src/shared/components';
import { REQUEST_STATUS } from 'src/shared/helpers/redux';

import { getData, selectProvider } from './redux/slice';
import { Swap, Pools } from './view/containers';

type Props = {
  view: 'Pools' | 'Swap';
};

const Provider: FC<Props> = ({ view }) => {
  const { status, error, shouldUpdateData } = useAppSelector(selectProvider);
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
  }, [dispatch, library, account, shouldUpdateData]);

  switch (status) {
    case REQUEST_STATUS.idle:
    case REQUEST_STATUS.pending:
    case REQUEST_STATUS.fulfilled: {
      const isLoading =
        status === REQUEST_STATUS.idle || status === REQUEST_STATUS.pending;
      const shouldDisplayProgress = status === REQUEST_STATUS.pending;

      switch (view) {
        case 'Swap': {
          return (
            <>
              {shouldDisplayProgress && <LinearProgress position="fixed-top" />}
              <Swap isLoading={isLoading} />
            </>
          );
        }
        case 'Pools': {
          return (
            <>
              {shouldDisplayProgress && <LinearProgress position="fixed-top" />}
              <Pools isLoading={isLoading} />
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
