import { FC } from 'react';
import NumberFormat from 'react-number-format';

import { TextField } from 'src/shared/components';

type Props = Pick<
  Parameters<typeof TextField>['0'],
  'disabled' | 'InputProps' | 'variant' | 'inputProps'
> & {
  value?: string | number | null;
  max?: string | number;
};

const NumberInput: FC<Props> = ({ ...textFieldProps }) => {
  return (
    <NumberFormat
      style={{ borderColor: 'transparent' }}
      allowNegative={false}
      customInput={TextField}
      {...textFieldProps}
      InputProps={{
        inputMode: 'decimal',
        placeholder: '0.0',
        ...textFieldProps.InputProps,
      }}
    />
  );
};

export type { Props };

export { NumberInput };
