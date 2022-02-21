import { parseCookies } from 'nookies';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import PagesEnum from '@enums/PagesEnum';
import CoockiesEnum from '@enums/CoockiesEnum';

export function withSSRGuest<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const coockies = parseCookies(ctx);

    if (coockies[CoockiesEnum.TOKEN]) {
      return {
        redirect: {
          destination: PagesEnum.DASHBOARD,
          permanent: false,
        },
      };
    }

    // eslint-disable-next-line no-return-await
    return await fn(ctx);
  };
}
