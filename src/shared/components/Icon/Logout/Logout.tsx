import { FC } from 'react';
import { SvgIconProps as MUIArrowRightAltIconProps } from '@mui/material';
import MUILogoutIcon from '@mui/icons-material/Logout';

type Props = MUIArrowRightAltIconProps;

const Logout: FC<Props> = ({ ...MUIProps }) => {
  return <MUILogoutIcon {...MUIProps} />;
};

export type { Props };

export { Logout };
