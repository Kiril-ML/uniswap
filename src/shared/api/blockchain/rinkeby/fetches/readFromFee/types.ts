import { ethers } from 'ethers';

import {
  RecordMethodsToItsParameters,
  RecordMethodsToItsReturnType,
} from 'src/shared/types';

import { FeeAPI } from '../../../types';

type QueryParameters = {
  contractParameters: {
    provider: ethers.providers.JsonRpcProvider;
  };
  methods: Partial<RecordMethodsToItsParameters<FeeAPI>>;
};
type Response = Partial<RecordMethodsToItsReturnType<FeeAPI>>;

export type { QueryParameters, Response };
