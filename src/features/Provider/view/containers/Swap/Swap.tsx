import { FC } from 'react';

import { SwapForm } from './SwapForm/SwapForm';

type Props = {
  isLoading: boolean;
};

const Swap: FC<Props> = ({ isLoading }) => {
  return <SwapForm isLoading={isLoading} />;
};

export type { Props };

export { Swap };
