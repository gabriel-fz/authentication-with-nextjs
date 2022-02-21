import { parseCookies, destroyCookie } from 'nookies';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import PagesEnum from '@enums/PagesEnum';
import CoockiesEnum from '@enums/CoockiesEnum';
import { AuthTokenError } from '@services/error/AuthTokenError';

export function withSSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (
    ctx: GetServerSidePropsContext,
    // eslint-disable-next-line consistent-return
  ): Promise<GetServerSidePropsResult<P>> => {
    const coockies = parseCookies(ctx);

    if (!coockies[CoockiesEnum.TOKEN]) {
      return {
        redirect: {
          destination: PagesEnum.LOGIN,
          permanent: false,
        },
      };
    }

    try {
      // eslint-disable-next-line no-return-await
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, CoockiesEnum.TOKEN);
        destroyCookie(ctx, CoockiesEnum.REFRESH_TOKEN);

        return {
          redirect: {
            destination: PagesEnum.LOGIN,
            permanent: false,
          },
        };
      }
    }
  };
}
