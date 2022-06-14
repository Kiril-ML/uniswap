import type { NextPageWithLayout } from 'src/shared/types';
import { PageHead, Typography } from 'src/shared/components';

const Mock: NextPageWithLayout = () => {
  return (
    <>
      <PageHead title="Заглушка" />
      <Typography variant="body1" color="initial">
        Этой страницы не должно быть в работающем приложении, обратитесь в
        техническую поддержку.
      </Typography>
    </>
  );
};

export { Mock };
