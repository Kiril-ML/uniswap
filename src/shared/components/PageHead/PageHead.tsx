import { FC } from 'react';
import Head from 'next/head';

type Props = {
  title: string;
  keywords?: string;
  description?: string;
};

const PageHead: FC<Props> = (props) => {
  const {
    title,
    children,
    keywords = 'MetaLamp, uniswap, clone, education',
    description = 'Clone of uniswap for education purpose.',
  } = props;

  return Head({
    children: (
      <>
        <title>{title}</title>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        {children}
      </>
    ),
  });
};

export type { Props };

export { PageHead };
