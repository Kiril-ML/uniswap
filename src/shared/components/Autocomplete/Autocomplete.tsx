import {
  AutocompleteProps as MUIAutocompleteProps,
  Autocomplete as MUIAutocomplete,
} from '@mui/material';

import { createStyles } from './Autocomplete.style';

type Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = MUIAutocompleteProps<T, Multiple, DisableClearable, FreeSolo> & {};

const Autocomplete = <
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  ...MUIProps
}: Props<T, Multiple, DisableClearable, FreeSolo>) => {
  const styles = createStyles();

  return <MUIAutocomplete css={styles.root()} {...MUIProps} />;
};

export type { Props };

export { Autocomplete };
