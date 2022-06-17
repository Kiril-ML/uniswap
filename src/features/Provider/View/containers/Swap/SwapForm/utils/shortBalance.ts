const shortBalance = (tokenBalance: string) => {
  return Number(tokenBalance).toFixed(4);
};

export { shortBalance };
