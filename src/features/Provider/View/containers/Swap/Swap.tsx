/* eslint-disable */
import { FC, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useTheme } from '@mui/material';
import { Rinkeby, useEtherBalance, useEthers, useToken } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';

import { Item } from 'src/features/Provider/types';

import { SwapForm } from './SwapForm/SwapForm';
import { createStyles } from './Swap.style';

type Props = {
  items: Item[];
};

const Swap: FC<Props> = ({ items }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // const { library, account } = useEthers();
  // const { data } = useAppSelector(selectProvider);
  // const dispatch = useAppDispatch();

  // const signer = library?.getSigner();

  return <SwapForm hint={<>{null}</>} items={items} />;
};

export type { Props };

export { Swap };
