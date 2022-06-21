import { FC, useState } from 'react';
import { useTheme } from '@mui/material';

import { createStyles } from './Pools.style';
import { AddLiquidityForm } from './AddLiquidityForm/AddLiquidityForm';
import { RemoveLiquidityForm } from './RemoveLiquidityForm/RemoveLiquidityForm';

type Props = {
  isLoading: boolean;
};

const Pools: FC<Props> = ({ isLoading }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [formType, setFormType] = useState<'AddLiquidity' | 'RemoveLiquidity'>(
    'AddLiquidity'
  );

  return formType === 'AddLiquidity' ? (
    <AddLiquidityForm isLoading={isLoading} handleChangeForm={setFormType} />
  ) : (
    <RemoveLiquidityForm
      handleChangeForm={setFormType}
      pairs={[]}
    ></RemoveLiquidityForm>
  );
};

export type { Props };

export { Pools };
