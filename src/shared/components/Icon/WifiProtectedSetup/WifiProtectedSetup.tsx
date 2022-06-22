import { FC } from 'react';
import { WifiProtectedSetup as MUIWifiProtectedSetup } from '@mui/icons-material';
import { SvgIconProps as MUIWarningIconProps } from '@mui/material';

type Props = MUIWarningIconProps & {};

const WifiProtectedSetup: FC<Props> = ({ ...MUIProps }) => {
  return <MUIWifiProtectedSetup {...MUIProps} />;
};

export type { Props };

export { WifiProtectedSetup };
