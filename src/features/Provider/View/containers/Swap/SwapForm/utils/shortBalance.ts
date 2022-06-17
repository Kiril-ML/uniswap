const shortBalance = (tokenBalance: string | undefined) => {
  if (tokenBalance === undefined) return null;

  return Number(tokenBalance).toFixed(4);
};

export { shortBalance };
