import { FC, SyntheticEvent } from 'react';
import { useTheme } from '@mui/material';

import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from 'src/shared/components';
import { Token } from 'src/features/Provider/types';

import {
  NumberInput,
  Props as NumberInputProps,
} from '../NumberInput/NumberInput';
import { createStyles } from './FieldWithAutocomplete.style';

type Props = NumberInputProps & {
  options: Token[];
  balance: string;
  max: string;
  optionsValue: Token;
  isMaxBtnDisplayed?: boolean;
  disabled?: boolean;
  isCalculating?: boolean;
  isCalculatingMaxAmountOutValue?: boolean;
  onAutocompleteChange: (
    event: SyntheticEvent<Element, Event>,
    value: Token | null | string | (string | Token)[],
    reason: 'createOption' | 'selectOption' | 'removeOption' | 'blur' | 'clear'
  ) => void;
  onMaxClick?: () => void;
};

const FieldWithAutocomplete: FC<Props> = ({
  options,
  balance,
  max,
  optionsValue,
  isMaxBtnDisplayed = false,
  disabled = false,
  isCalculating = false,
  isCalculatingMaxAmountOutValue = false,
  onMaxClick,
  onAutocompleteChange,
  ...maskedDecimalFieldProps
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const value = optionsValue.address === '' ? null : optionsValue;

  return (
    <NumberInput
      css={styles.root()}
      isCalculating={isCalculating}
      variant="filled"
      {...maskedDecimalFieldProps}
      InputProps={{
        disableUnderline: true,
        endAdornment: (
          <InputAdornment
            position="end"
            orientation={'vertical'}
            css={styles.inputAdornment()}
          >
            <Autocomplete
              css={styles.autocomplete()}
              options={options}
              clearOnBlur
              value={value}
              loading={options.length === 0}
              isOptionEqualToValue={(option, val) =>
                option.decimals === val.decimals
              }
              getOptionLabel={(option) => {
                if (typeof option !== 'string') return option.symbol;

                return '';
              }}
              renderOption={(props, option) => (
                <Box css={styles.option()} component="li" {...props}>
                  <Box css={styles.optionAvatar()}>
                    <Avatar
                      src={option.image}
                      alt={`???????????? ${option.name}`}
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
                  label="??????????"
                  size="small"
                  fullWidth
                />
              )}
              fullWidth
              disabled={disabled}
              onChange={onAutocompleteChange}
            />
            <Box css={styles.caption()}>
              <Typography
                css={styles.captionBalance()}
                variant="caption"
                title={balance}
                noWrap
              >
                ????????????: {balance}
              </Typography>
              {isCalculatingMaxAmountOutValue ? (
                <Box css={styles.maxValueBox()}>
                  <Typography
                    css={styles.captionBalance()}
                    variant="caption"
                    title={'loading'}
                    noWrap
                  >
                    ????????:
                  </Typography>
                  <CircularProgress css={styles.progress()}></CircularProgress>
                </Box>
              ) : (
                <Typography
                  css={styles.captionBalance()}
                  variant="caption"
                  title={max}
                  noWrap
                >
                  ????????: {max}
                </Typography>
              )}

              {isMaxBtnDisplayed && (
                <Button
                  css={styles.addMaxBtn()}
                  type="button"
                  size="small"
                  color="secondary"
                  disabled={disabled}
                  fullWidth
                  onClick={onMaxClick}
                >
                  ????????
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
