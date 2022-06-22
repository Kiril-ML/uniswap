import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { formatUnits } from '@ethersproject/units';

import { isError } from 'src/shared/types/guards';
import { fetchReadFromERC20Pair } from 'src/shared/api/blockchain/rinkeby/fetches/readFromERC20Pair';

import { State } from '../../types';

type Options = {
  pairAddress: string;
  tokenInAddress: string;
  tokenOutAddress: string;
  amountIn: ethers.BigNumber;
  provider: ethers.providers.JsonRpcProvider;
};

const calculateAmountOut = createAsyncThunk(
  'Provider/calculateAmountOut',
  async ({
    tokenInAddress,
    pairAddress,
    tokenOutAddress,
    amountIn,
    provider,
  }: Options): Promise<State['calculatedAmountOutValue']> => {
    const pair = await fetchReadFromERC20Pair({
      contractParameters: { address: pairAddress, provider },
      methods: {
        calculateAmoutOut: [tokenInAddress, tokenOutAddress, amountIn],
        decimals: [],
      },
    });

    if (isError(pair)) {
      return Promise.reject(pair);
    }

    if (pair.calculateAmoutOut === undefined || pair.decimals === undefined) {
      return Promise.reject(new Error('calculation error'));
    }

    const [amountOut, tokenOutFee] = pair.calculateAmoutOut;
    const { decimals } = pair;

    return {
      amountOut: formatUnits(amountOut, decimals),
      tokenOutFee: formatUnits(tokenOutFee, decimals),
      decimals,
    };
  }
);

export { calculateAmountOut };
