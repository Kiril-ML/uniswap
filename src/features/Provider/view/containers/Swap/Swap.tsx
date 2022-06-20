import { useContractFunction, useEthers } from '@usedapp/core';
import { FC } from 'react';

import {
  createReadRegistry,
  createWriteToERC20,
  createWriteToRouter,
} from 'src/shared/api/blockchain/rinkeby/createContract';

import { SwapForm } from './SwapForm/SwapForm';

type Props = {
  isLoading: boolean;
};

const Swap: FC<Props> = ({ isLoading }) => {
  const { library } = useEthers();

  let readRegistryContract;
  let writeERC20Contract;
  let writeRouterContract;

  const { send } = useContractFunction(readRegistryContract, 'getPair');

  const onSubmit = ({ tokenInAddress }) => {
    if (library !== undefined) {
      const signer = library.getSigner();

      readRegistryContract = createReadRegistry(library);
      writeERC20Contract = createWriteToERC20(tokenInAddress, signer);
      writeRouterContract = createWriteToRouter(signer);
    }
  };

  return <SwapForm isLoading={isLoading} onSubmit={onSubmit} />;
};

export type { Props };

export { Swap };
