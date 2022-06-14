import type { NextPageWithLayout } from 'src/shared/types';
import { useTimeoutRedirect } from 'src/shared/helpers/react';
import { PageHead, Typography } from 'src/shared/components';

const NotFound: NextPageWithLayout = () => {
  const redirectTimeout = useTimeoutRedirect();

  return (
    <>
      <PageHead title="Интегратор - страница не найдена" />
      <Typography variant="body1" color="initial">
        Страница не найдена, перенаправление на главную страницу через{' '}
        {redirectTimeout} секунд...
      </Typography>
    </>
  );
};

export { NotFound };
