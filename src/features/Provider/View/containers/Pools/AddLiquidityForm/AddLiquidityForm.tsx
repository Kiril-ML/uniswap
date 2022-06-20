import { useTheme } from '@mui/material';
import { Dispatch, FC, ReactElement, SetStateAction } from 'react';

import { Box } from 'src/shared/components';

import { createStyles } from './AddLiquidityForm.style';

type Props = {
  handleChangeForm?: Dispatch<
    SetStateAction<'RemoveLiquidity' | 'AddLiquidity'>
  >;
  hint?: ReactElement;
};

const AddLiquidityForm: FC<Props> = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return <Box css={styles.root()}></Box>;
};

export type { Props };

export { AddLiquidityForm };
