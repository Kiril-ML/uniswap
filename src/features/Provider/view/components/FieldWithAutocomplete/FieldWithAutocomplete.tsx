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
  handleAutocompleteChange: (
    event: SyntheticEvent<Element, Event>,
    value: Token | null | string | (string | Token)[],
    reason: 'createOption' | 'selectOption' | 'removeOption' | 'blur' | 'clear'
  ) => void;
  handleMaxClick?: () => void;
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
  handleMaxClick,
  handleAutocompleteChange,
  ...maskedDecimalFieldProps
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

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
              value={optionsValue}
              isOptionEqualToValue={(option, value) =>
                option.decimals === value.decimals
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
                      alt={`иконка ${option.name}`}
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
                  label="токен"
                  size="small"
                  fullWidth
                />
              )}
              fullWidth
              disabled={disabled}
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
              {isCalculatingMaxAmountOutValue ? (
                <Box css={styles.maxValueBox()}>
                  <Typography
                    css={styles.captionBalance()}
                    variant="caption"
                    title={'loading'}
                    noWrap
                  >
                    макс:
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
                  макс: {max}
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
                  onClick={handleMaxClick}
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
