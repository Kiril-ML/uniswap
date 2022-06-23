import { FC } from 'react';
import {
  CollapseProps as MUICollapseProps,
  Collapse as MUICollapse,
} from '@mui/material';

type Props = MUICollapseProps & {};

const Collapse: FC<Props> = ({ ...MUIProps }) => {
  return <MUICollapse {...MUIProps} />;
};

export type { Props };

export { Collapse };
