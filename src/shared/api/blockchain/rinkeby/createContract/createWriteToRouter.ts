import { Contract, ethers } from 'ethers';

import { contracts } from '../constants';

const createWriteToRouter = (signer: ethers.providers.JsonRpcSigner | null) => {
  const { router } = contracts;
  const { address, ABI } = router;

  if (signer === null) {
    return null;
  }

  return new Contract(address, ABI, signer);
};

export { createWriteToRouter };
