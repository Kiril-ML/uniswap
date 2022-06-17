import { FC } from 'react';
import { useTheme } from '@mui/material';

import { SwapForm } from './SwapForm/SwapForm';
import { createStyles } from './Swap.style';

type Props = {
  isLoading: boolean;
};

const Swap: FC<Props> = ({ isLoading }) => {
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const styles = createStyles(theme);

  // const signer = library?.getSigner();

  return <SwapForm isLoading={isLoading} hint={<>{null}</>} />;
};

export type { Props };

export { Swap };
