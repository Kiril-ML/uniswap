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
  amountOut: ethers.BigNumber;
  provider: ethers.providers.JsonRpcProvider;
};

const calculateAmountIn = createAsyncThunk(
  'Provider/calculateAmountIn',
  async ({
    tokenInAddress,
    pairAddress,
    tokenOutAddress,
    amountOut,
    provider,
  }: Options): Promise<State['calculatedAmountInValue']> => {
    const pair = await fetchReadFromERC20Pair({
      contractParameters: { address: pairAddress, provider },
      methods: {
        calculateAmoutIn: [tokenInAddress, tokenOutAddress, amountOut],
        decimals: [],
      },
    });

    if (isError(pair)) {
      return Promise.reject(pair);
    }

    if (pair.calculateAmoutIn === undefined || pair.decimals === undefined) {
      return Promise.reject(new Error('calculation error'));
    }

    const [amountIn, tokenInFee] = pair.calculateAmoutIn;
    const { decimals } = pair;

    return {
      amountIn: formatUnits(amountIn, decimals),
      tokenInFee: formatUnits(tokenInFee, decimals),
      decimals,
    };
  }
);

export { calculateAmountIn };
