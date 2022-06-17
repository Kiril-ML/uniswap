import { Token } from 'src/features/Provider/types';

const changeButtonText = ({
  firstToken,
  secondToken,
  firstTokenValue,
  secondTokenValue,
  isShouldDisabled,
}: {
  firstToken: Token;
  secondToken: Token;
  firstTokenValue: string;
  secondTokenValue: string;
  isShouldDisabled: boolean;
}) => {
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
