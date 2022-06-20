import { Contract, ethers } from 'ethers';

import { contracts } from '../constants';

const createReadRegistry = (
  provider: ethers.providers.JsonRpcProvider | undefined
) => {
  const { registry } = contracts;
  const { address, ABI } = registry;

  if (provider === undefined) {
    return null;
  }

  return new Contract(address, ABI, provider);
};

export { createReadRegistry };
