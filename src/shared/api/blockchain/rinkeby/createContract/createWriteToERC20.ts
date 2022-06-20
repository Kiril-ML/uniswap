import { Contract, ethers } from 'ethers';

import { ERC20ABI } from '../../constants';

const createWriteToERC20 = (
  tokenInAddress: string,
  signer: ethers.providers.JsonRpcSigner | null
) => {
  if (signer === null) {
    return null;
  }

  return new Contract(tokenInAddress, ERC20ABI, signer);
};

export { createWriteToERC20 };
