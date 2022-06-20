import { FC, useState } from 'react';
import { useTheme } from '@mui/material';

import { createStyles } from './Pools.style';
import { AddLiquidityForm } from './AddLiquidityForm/AddLiquidityForm';
import { RemoveLiquidityForm } from './RemoveLiquidityForm/RemoveLiquidityForm';

type Props = {
  items?: any;
};

const Pools: FC<Props> = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [formType, setFormType] = useState<'AddLiquidity' | 'RemoveLiquidity'>(
    'AddLiquidity'
  );

  return formType === 'AddLiquidity' ? (
    <AddLiquidityForm
      css={styles.root()}
      hint={<>{null}</>}
      handleChangeForm={setFormType}
    />
  ) : (
    <RemoveLiquidityForm
      handleChangeForm={setFormType}
      pairs={[]}
    ></RemoveLiquidityForm>
  );
};

export type { Props };

export { Pools };
