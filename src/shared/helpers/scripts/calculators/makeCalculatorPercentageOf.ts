const makeCalculatorPercentageOf = (max: number) => {
  return (px: number) => (px / max) * 100;
};

export { makeCalculatorPercentageOf };
