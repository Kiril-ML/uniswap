import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Box } from './Box';

const Meta: ComponentMeta<typeof Box> = {
  title: 'components/Box',
  component: Box,
};

const Template: ComponentStory<typeof Box> = (props) => <Box {...props} />;

const Default = Template.bind({});
Default.args = {};

export { Default };

export default Meta;
