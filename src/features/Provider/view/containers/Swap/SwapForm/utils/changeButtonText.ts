import { Token } from 'src/features/Provider/types';

import { SubmitButtonValue } from '../../types';

type Args = {
  firstToken: Token;
  secondToken: Token;
  firstTokenValue: string;
  secondTokenValue: string;
  isShouldDisabled: boolean;
  activeTransaction: boolean;
};

const changeButtonText = ({
  firstToken,
  secondToken,
  firstTokenValue,
  secondTokenValue,
  isShouldDisabled,
  activeTransaction,
}: Args): SubmitButtonValue => {
  if (activeTransaction) {
    return 'Идет транзакция...';
  }

  if (isShouldDisabled) {
    return 'Подключите кошелек';
  }

  if (firstToken.address === '' || secondToken.address === '') {
    return 'Выберите токены';
  }

  if (
    firstToken.address !== '' &&
    secondToken.address !== '' &&
    (firstTokenValue === '' || secondTokenValue === '')
  ) {
    return 'Укажите количество';
  }

  if (
    firstToken.address !== '' &&
    secondToken.address !== '' &&
    firstTokenValue !== '' &&
    secondTokenValue !== ''
  ) {
    return 'Обменять';
  }

  return 'Подключите кошелек';
};

export { changeButtonText };
