import { useTheme } from '@mui/material';
import { FC, ReactElement } from 'react';
import { useForm } from 'react-hook-form';

import {
  Box,
  Button,
  Card,
  Typography,
  InputAdornment,
  ArrowDown,
} from 'src/shared/components';

import {
  FieldWithAutocomplete,
  Props as FieldWithAutocompleteProps,
} from '../FieldWithAutocomplete/FieldWithAutocomplete';
import { NumberInput } from '../NumberInput/NumberInput';
import { createStyles } from './SwapForm.style';
// import { FormState } from './types';

type Item = { key: string; name: string; symbol: string; image: string };
type HandleAutocompleteChange =
  FieldWithAutocompleteProps['handleAutocompleteChange'];

type Props = {
  itemValues?: (Item | null)[];
  onPairSet?: (data: { pair: (Item | null)[]; isSet: boolean }) => void;
  value?: string | number | null;
  max?: string;
  hint?: ReactElement;
};

const SwapForm: FC<Props> = ({ hint }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const { setValue, getValues, handleSubmit, register } = useForm({
    defaultValues: {
      theFirstToken: '',
      theFirstTokenValue: '',
      theSecondToken: '',
      theSecondTokenValue: '',
      slippage: 0,
    },
  });
  const tokens = [
    {
      key: '1',
      name: 'Token',
      symbol: 'TK',
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA4pJREFUeF7t3SFyFFEURuEewwJQLIIFYPERqTg8y6Ji41IIPPuIQqKwVGFgEUf89ciHv9Uv/z1z3n1DT/ft/dfff6/hv29fPqar333+nupr8enrvwGgIQCAlt91eoCnr58BXjnAAACAIbAwYAso6V2XGWB8irEFvHKAAQAAM0BhwAxQ0jMDXOtvMm0BrxxgAADADFAYMAOU9MwAZoDTP0Gnr//28nif7gd4ePuUHPD861OqP714nR8AxgQBgAESgtWgDJDi78UMwACJIgZI8e2LGYABEoUMkOLbFzMAAyQKGSDFty9mAAZIFDJAim9fzAAMkChkgBTfvpgBGCBRyAApvn3x3AA/7j6k+wH+PLxLKb55/pnq13fV1htC1vndAJD4yz9tAwADJAKrQRkgxd9/3MoADJAQZIDxz6sNgU4B6RNsC7AFJIBsAbaABJBTQIrPKeBa72G+CWzfpDIAA/i/gMKAY6BjYOFnvoXaAlL7DIFzgg2BcQisj4uve2BtYL0jJgrgqjd0rPPLD4la/wEAaC/MAEBUAAOMX/nCAAwQP8OtnAEYIBG0nqHMAKl9l1PAmmAzgBkgfoZbuRnADJAIWhvUDJDaZwbIv4zxVfD21bkMwADtfQHrPcwpwCkgfoZbuVOAU0AiaG3QPAOsFZzS/w+Kq4EAcDgEADi8gXX5AKgJHl4PgMMbWJcPgJrg4fUAOLyBdfkAqAkeXg+AwxtYlw+AmuDh9QA4vIF1+QCoCR5eD4DDG1iXD4Ca4OH1ADi8gXX5AKgJHl6fAXh5vE/vC6gPKqw3hR7ev3xTbX1KW357OAAagvWOIAC0/OfVABg/6nVNAAAAkBi0BaT49sUMwACJQgZI8e2LGYABEoUMkOLbFzMAAyQKGSDFty9mAAZIFDJAim9fzAAMkChkgBTfvnhugPq+gHWE6+cT1Bsy1vnl5wOs/wAAtA4AoOWXnxUcL5/LARAjtAXEAGu5LaAlyAAtP1tAzC+XM0CLkAFafgwQ88vlDNAiZICWHwPE/HI5A7QIGaDlxwAxv1zOAC1CBmj5MUDML5czQIuQAVp+5xugPh/g9P8Mif2fl1cD5ucDAGDLAAC2+c+vDoB5C7YLAMA2//nVATBvwXYBANjmP786AOYt2C4AANv851cHwLwF2wUAYJv//OoAmLdguwAAbPOfXx0A8xZsFwCAbf7zqwNg3oLtAioA/wCgkDC9i/OrjAAAAABJRU5ErkJggg==',
    },
    {
      key: '2',
      name: 'Token2',
      symbol: 'TK2',
      image:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAA4pJREFUeF7t3SFyFFEURuEewwJQLIIFYPERqTg8y6Ji41IIPPuIQqKwVGFgEUf89ciHv9Uv/z1z3n1DT/ft/dfff6/hv29fPqar333+nupr8enrvwGgIQCAlt91eoCnr58BXjnAAACAIbAwYAso6V2XGWB8irEFvHKAAQAAM0BhwAxQ0jMDXOtvMm0BrxxgAADADFAYMAOU9MwAZoDTP0Gnr//28nif7gd4ePuUHPD861OqP714nR8AxgQBgAESgtWgDJDi78UMwACJIgZI8e2LGYABEoUMkOLbFzMAAyQKGSDFty9mAAZIFDJAim9fzAAMkChkgBTfvpgBGCBRyAApvn3x3AA/7j6k+wH+PLxLKb55/pnq13fV1htC1vndAJD4yz9tAwADJAKrQRkgxd9/3MoADJAQZIDxz6sNgU4B6RNsC7AFJIBsAbaABJBTQIrPKeBa72G+CWzfpDIAA/i/gMKAY6BjYOFnvoXaAlL7DIFzgg2BcQisj4uve2BtYL0jJgrgqjd0rPPLD4la/wEAaC/MAEBUAAOMX/nCAAwQP8OtnAEYIBG0nqHMAKl9l1PAmmAzgBkgfoZbuRnADJAIWhvUDJDaZwbIv4zxVfD21bkMwADtfQHrPcwpwCkgfoZbuVOAU0AiaG3QPAOsFZzS/w+Kq4EAcDgEADi8gXX5AKgJHl4PgMMbWJcPgJrg4fUAOLyBdfkAqAkeXg+AwxtYlw+AmuDh9QA4vIF1+QCoCR5eD4DDG1iXD4Ca4OH1ADi8gXX5AKgJHl6fAXh5vE/vC6gPKqw3hR7ev3xTbX1KW357OAAagvWOIAC0/OfVABg/6nVNAAAAkBi0BaT49sUMwACJQgZI8e2LGYABEoUMkOLbFzMAAyQKGSDFty9mAAZIFDJAim9fzAAMkChkgBTfvnhugPq+gHWE6+cT1Bsy1vnl5wOs/wAAtA4AoOWXnxUcL5/LARAjtAXEAGu5LaAlyAAtP1tAzC+XM0CLkAFafgwQ88vlDNAiZICWHwPE/HI5A7QIGaDlxwAxv1zOAC1CBmj5MUDML5czQIuQAVp+5xugPh/g9P8Mif2fl1cD5ucDAGDLAAC2+c+vDoB5C7YLAMA2//nVATBvwXYBANjmP786AOYt2C4AANv851cHwLwF2wUAYJv//OoAmLdguwAAbPOfXx0A8xZsFwCAbf7zqwNg3oLtAioA/wCgkDC9i/OrjAAAAABJRU5ErkJggg==',
    },
  ];
  const state = getValues();
  const { theFirstToken, theSecondToken } = state;

  const handleTheFirstTokenAutocompleteChange: HandleAutocompleteChange = (
    event,
    value
  ) => {
    setValue('theFirstToken', value?.name || '');
  };

  const handleTheSecondTokenAutocompleteChange: HandleAutocompleteChange = (
    event,
    value
  ) => {
    setValue('theSecondToken', value?.name || '');
  };

  const handleRootSubmit: (data: any) => void = (data) => {
    // onSubmit(data);
    console.log(data);
  };

  return (
    <Card
      css={styles.root()}
      content={{
        children: (
          <form onSubmit={handleSubmit(handleRootSubmit)}>
            <Box>
              <Typography>Обменять</Typography>
            </Box>
            <FieldWithAutocomplete
              inputProps={{
                ...register('theFirstTokenValue'),
              }}
              handleAutocompleteChange={handleTheFirstTokenAutocompleteChange}
              options={tokens.filter((token) => token.name !== theSecondToken)}
              optionText={theFirstToken}
            />
            <Box css={styles.arrow()}>
              <ArrowDown></ArrowDown>
            </Box>
            <FieldWithAutocomplete
              inputProps={{
                ...register('theSecondTokenValue'),
              }}
              options={tokens.filter((token) => token.name !== theFirstToken)}
              optionText={theSecondToken}
              handleAutocompleteChange={handleTheSecondTokenAutocompleteChange}
            />
            {hint}
            <Box>
              <Typography>Допустимое проскальзывание ?</Typography>
              <NumberInput
                variant="filled"
                {...register('slippage')}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end" orientation={'horizontal'}>
                      %
                    </InputAdornment>
                  ),
                }}
              ></NumberInput>
            </Box>
            <Button
              type="submit"
              css={styles.button()}
              variant="contained"
              fullWidth
            >
              Выберете токен
            </Button>
          </form>
        ),
      }}
    ></Card>
  );
};

export type { Props };

export { SwapForm };
