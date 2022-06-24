import { Token } from 'src/features/Provider/types';

import { SubmitButtonValue } from '../types';

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

  const isTokenChosen = firstToken.address !== '' && secondToken.address !== '';

  if (!isTokenChosen) {
    return 'Выберите токены';
  }

  const isTokenNullValue =
    isTokenChosen &&
    (firstTokenValue === '' ||
      secondTokenValue === '' ||
      +firstTokenValue === 0 ||
      +secondTokenValue === 0);

  if (isTokenNullValue) {
    return 'Укажите количество';
  }

  const isTokenFillValue =
    firstToken.address !== '' &&
    secondToken.address !== '' &&
    firstTokenValue !== '' &&
    secondTokenValue !== '' &&
    +firstTokenValue !== 0 &&
    +secondTokenValue !== 0;

  if (isTokenFillValue) {
    return 'Добавить ликвидность';
  }

  return 'Подключите кошелек';
};

export { changeButtonText };
