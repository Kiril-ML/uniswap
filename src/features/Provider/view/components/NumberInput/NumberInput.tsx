import { FC } from 'react';
import NumberFormat from 'react-number-format';

import { TextField } from 'src/shared/components';

type Props = Pick<
  Parameters<typeof TextField>['0'],
  'disabled' | 'InputProps' | 'variant' | 'inputProps'
> & {
  isCalculating?: boolean;
  css?: any;
};

const NumberInput: FC<Props> = ({
  isCalculating = false,
  ...textFieldProps
}) => {
  const style = isCalculating ? { color: 'transparent' } : {};
  const placeholder = isCalculating ? '' : '0.0';

  return (
    <NumberFormat
      allowNegative={false}
      customInput={TextField}
      {...textFieldProps}
      InputProps={{
        inputMode: 'decimal',
        placeholder,
        style,
        ...textFieldProps.InputProps,
      }}
    />
  );
};

export type { Props };

export { NumberInput };
