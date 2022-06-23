import { FC, useState } from 'react';

import { AddLiquidityForm } from './AddLiquidityForm/AddLiquidityForm';
import { RemoveLiquidityForm } from './RemoveLiquidityForm/RemoveLiquidityForm';

type Props = {
  isLoading: boolean;
};

const Pools: FC<Props> = ({ isLoading }) => {
  const [formType, setFormType] = useState<'AddLiquidity' | 'RemoveLiquidity'>(
    'AddLiquidity'
  );

  return formType === 'AddLiquidity' ? (
    <AddLiquidityForm isLoading={isLoading} handleChangeForm={setFormType} />
  ) : (
    <RemoveLiquidityForm
      handleChangeForm={setFormType}
      isLoading={isLoading}
    ></RemoveLiquidityForm>
  );
};

export type { Props };

export { Pools };
