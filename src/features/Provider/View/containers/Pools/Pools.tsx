/* eslint-disable */
import { FC, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useTheme } from '@mui/material';
import { Rinkeby, useEtherBalance, useEthers, useToken } from '@usedapp/core';
import { formatEther } from '@ethersproject/units';

import { Item } from 'src/features/Provider/types';

import { createStyles } from './Pools.style';
import { AddLiquidityForm } from './AddLiquidityForm/AddLiquidityForm';
import { RemoveLiquidityForm } from './RemoveLiquidityForm/RemoveLiquidityForm';

type Props = {
  items: Item[];
};

const Pools: FC<Props> = ({ items }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [formType, setFormType] = useState<'AddLiquidity' | 'RemoveLiquidity'>(
    'AddLiquidity'
  );

  // const { library, account } = useEthers();
  // const { data } = useAppSelector(selectProvider);
  // const dispatch = useAppDispatch();

  // const signer = library?.getSigner();

  return formType === 'AddLiquidity' ? (
    <AddLiquidityForm
      hint={<>{null}</>}
      items={items}
      handleChangeForm={setFormType}
    />
  ) : (
    <RemoveLiquidityForm
      items={items}
      handleChangeForm={setFormType}
    ></RemoveLiquidityForm>
  );
};

export type { Props };

export { Pools };
