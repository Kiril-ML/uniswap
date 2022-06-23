const shortBalance = (tokenBalance: string) => {
  return Number(tokenBalance).toFixed(5);
};

export { shortBalance };
