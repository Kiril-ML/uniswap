import { FC } from 'react';
import { SvgIconProps as MUIMenuIconProps } from '@mui/material';
import MUICloseIcon from '@mui/icons-material/Close';

type Props = MUIMenuIconProps & {};

const CloseIcon: FC<Props> = ({ ...MUIProps }) => {
  return <MUICloseIcon {...MUIProps} />;
};

export type { Props };

export { CloseIcon };
