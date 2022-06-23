import { ethers } from 'ethers';

import { fetchReadFromERC20 } from 'src/shared/api/blockchain/rinkeby/fetches/readFromERC20';
import { fetchReadFromERC20Pair } from 'src/shared/api/blockchain/rinkeby/fetches/readFromERC20Pair';
import { fetchReadFromRegistry } from 'src/shared/api/blockchain/rinkeby/fetches/readFromRegistry';
import { Address } from 'src/shared/api/blockchain/types';
import { BigNumber, formatUnits } from 'src/shared/helpers/blockchain/numbers';
import { isError, isNotError, isNotNull } from 'src/shared/types/guards';

import { Token, Pair } from '../../../types';
import { combineTokenInPairs } from '../../../utils';

type Options = {
  tokens: Token[];
  userAddress: Address;
  provider: ethers.providers.JsonRpcProvider;
};

const getPairs = async ({
  tokens,
  userAddress,
  provider,
}: Options): Promise<Partial<Pair>[] | Error> => {
  const pairs = combineTokenInPairs(tokens);

  const pairsData = await Promise.all(
    pairs.map(async ({ token0, token1 }) => {
      const registry = await fetchReadFromRegistry({
        contractParameters: { provider },
        methods: { getPair: [token0.address, token1.address] },
      });

      if (isError(registry)) {
        return registry;
      }

      const pairAddress = registry.getPair || '0x0';
      const hasPair = !/^0x0+$/.test(pairAddress);

      if (!hasPair) {
        return null;
      }

      const userPair = await fetchReadFromERC20({
        contractParameters: { address: pairAddress, provider },
        methods: { balanceOf: [userAddress], decimals: [] },
      });

      if (isError(userPair)) {
        return userPair;
      }

      const pair = await fetchReadFromERC20Pair({
        contractParameters: { address: pairAddress, provider },
        methods: {
          name: [],
          symbol: [],
        },
      });

      if (isError(pair)) {
        return pair;
      }

      const pairToken0 = await fetchReadFromERC20({
        contractParameters: { address: token0.address, provider },
        methods: { balanceOf: [pairAddress], name: [] },
      });

      if (isError(pairToken0)) {
        return pairToken0;
      }

      const pairToken1 = await fetchReadFromERC20({
        contractParameters: { address: token1.address, provider },
        methods: { balanceOf: [pairAddress], name: [] },
      });

      if (isError(pairToken1)) {
        return pairToken1;
      }

      const { balanceOf, decimals } = userPair;
      const { balanceOf: balanceOfToken0 } = pairToken0;
      const { balanceOf: balanceOfToken1 } = pairToken1;

      const isProportionUndefined =
        balanceOfToken0 === undefined ||
        balanceOfToken1 === undefined ||
        balanceOfToken0.isZero() ||
        balanceOfToken1.isZero();

      let formattedBalanceOfToken0;
      let formattedBalanceOfToken1;
      let proportion;

      if (isProportionUndefined) {
        formattedBalanceOfToken0 = '0';
        formattedBalanceOfToken1 = '0';
        proportion = 'any';
      } else {
        formattedBalanceOfToken0 = formatUnits(
          balanceOfToken0,
          token0.decimals
        );
        formattedBalanceOfToken1 = formatUnits(
          balanceOfToken1,
          token1.decimals
        );
        proportion = new BigNumber(formattedBalanceOfToken0)
          .div(formattedBalanceOfToken1)
          .toString();
      }

      return {
        address: pairAddress,
        tokenNames: [token0.name, token1.name] as [string, string],
        tokens: [
          { ...token0, pairBalance: formattedBalanceOfToken0 },
          { ...token1, pairBalance: formattedBalanceOfToken1 },
        ],
        proportion,
        userBalance: balanceOf && formatUnits(balanceOf, decimals),
        decimals,
        pairNames: pair.name,
        pairSymbol: pair.symbol,
      };
    })
  );

  if (isError(pairsData)) {
    return pairsData;
  }

  return pairsData.filter(isNotError).filter(isNotNull);
};

export { getPairs };
