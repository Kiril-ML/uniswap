import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { fetchWriteToRouter } from 'src/shared/api/blockchain/rinkeby/fetches/writeToRouter';
import { Address } from 'src/shared/api/blockchain/types';
import { isError } from 'src/shared/types/guards';

type Options = {
  token0Address: Address;
  token1Address: Address;
  amountLP: ethers.BigNumber;
  signer: ethers.providers.JsonRpcSigner;
};

const removeLiquidity = createAsyncThunk(
  'Provider/removeLiquidity',
  async ({
    token0Address,
    token1Address,
    amountLP,
    signer,
  }: Options): Promise<void> => {
    const txRouter = await fetchWriteToRouter({
      contractParameters: { signer },
      methods: {
        removeLiquidity: [token0Address, token1Address, amountLP],
      },
    });

    if (isError(txRouter)) {
      return Promise.reject(txRouter);
    }

    await txRouter.removeLiquidity.wait();

    return undefined;
  }
);

export { removeLiquidity };
