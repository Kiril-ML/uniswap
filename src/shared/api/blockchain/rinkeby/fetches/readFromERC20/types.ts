import { ethers } from 'ethers';

import {
  RecordMethodsToItsParameters,
  RecordMethodsToItsReturnType,
} from 'src/shared/types';

import { Address, ERC20ReadAPI } from '../../../types';

type QueryParameters = {
  contractParameters: {
    address: Address;
    provider: ethers.providers.JsonRpcProvider;
  };
  methods: Partial<RecordMethodsToItsParameters<ERC20ReadAPI>>;
};
type Response = Partial<RecordMethodsToItsReturnType<ERC20ReadAPI>>;

export type { QueryParameters, Response };
