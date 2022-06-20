import { useContractFunction } from '@usedapp/core';
import { ethers } from 'ethers';

import { createReadRegistry } from 'src/shared/api/blockchain/rinkeby/createContract';

const useRegistry = (library: ethers.providers.JsonRpcProvider | undefined) => {
  const readRegistryContract = createReadRegistry(library);
  const { send, state } = useContractFunction(readRegistryContract, 'getPair');

  if (library === undefined) {
    return { send: null, state: null };
  }

  return { send, state };
};

export { useRegistry };
