import { useContractFunction } from '@usedapp/core';
import { ethers } from 'ethers';

import { createWriteToERC20 } from 'src/shared/api/blockchain/rinkeby/createContract';

const useApprove = (
  firstTokenValue: string,
  signer: ethers.providers.JsonRpcSigner | null
) => {
  const writeERC20Contract = createWriteToERC20(firstTokenValue, signer);
  const { send, state } = useContractFunction(writeERC20Contract, 'approve');

  if (signer === undefined) {
    return null;
  }

  return { send, state };
};

export { useApprove };
