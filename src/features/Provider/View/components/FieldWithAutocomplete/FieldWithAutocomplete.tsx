/* eslint-disable multiline-comment-style */
import { FC, SyntheticEvent } from 'react';
import { useTheme } from '@mui/material';

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from 'src/shared/components';

import {
  NumberInput,
  Props as NumberInputProps,
} from '../NumberInput/NumberInput';
import { createStyles } from './FieldWithAutocomplete.style';

type Item = { key: string; name: string; symbol: string; image: string };

type Props = NumberInputProps & {
  options: Item[];
  optionValue?: Item | null;
  shouldResetOption?: boolean;
  optionText: string;
  value?: string;
  balance?: string;
  isMaxBtnDisplayed?: boolean;
  handleAutocompleteChange: (
    event: SyntheticEvent<Element, Event>,
    value: Item | null,
    reason: 'createOption' | 'selectOption' | 'removeOption' | 'blur' | 'clear'
  ) => void;
};

const FieldWithAutocomplete: FC<Props> = ({
  options = [
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
  ],
  optionText = 'токен',
  balance = 'balance',
  isMaxBtnDisplayed = false,
  handleAutocompleteChange,
  ...maskedDecimalFieldProps
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <NumberInput
      css={styles.root()}
      variant="filled"
      {...maskedDecimalFieldProps}
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <InputAdornment position="end" orientation={'vertical'}>
            <Autocomplete
              css={styles.autocomplete()}
              options={options}
              isOptionEqualToValue={(option, value) =>
                option.name === value?.name
              }
              getOptionLabel={({ symbol }) => symbol}
              renderOption={(props, option) => (
                <Box css={styles.option()} component="li" {...props}>
                  <Box css={styles.optionAvatar()}>
                    <Avatar
                      src={option.image}
                      alt={`иконка ${optionText}`}
                      hasBorder={false}
                      hasImage
                    />
                  </Box>
                  <Typography
                    css={styles.optionText()}
                    title={option.name}
                    noWrap
                  >
                    {option.symbol}
                  </Typography>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  css={styles.input()}
                  label={`${optionText}`}
                  size="small"
                  fullWidth
                />
              )}
              fullWidth
              disabled={false}
              onChange={handleAutocompleteChange}
            />
            <Box css={styles.caption()}>
              <Typography
                css={styles.captionBalance()}
                variant="caption"
                title={balance}
                noWrap
              >
                Баланс: {balance}
              </Typography>
              {isMaxBtnDisplayed && (
                <Button
                  css={styles.addMaxBtn()}
                  type="button"
                  size="small"
                  color="secondary"
                  // disabled={disabled}
                  fullWidth
                  // onClick={handleMaxClick}
                >
                  макс
                </Button>
              )}
            </Box>
          </InputAdornment>
        ),
      }}
    />
  );
};

export type { Props };

export { FieldWithAutocomplete };
