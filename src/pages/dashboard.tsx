import { useContext, useEffect } from 'react';
import { destroyCookie } from 'nookies';

import { AuthContext } from '@contexts/AuthContext';
import { withSSRAuth } from '@utils/withSSRAuth';
import { api } from '@services/apiClient';
import { setupAPIClient } from '@services/api';
import PagesEnum from '@enums/PagesEnum';
import CoockiesEnum from '@enums/CoockiesEnum';

import Head from '@components/Head';

import styles from '@page-styles/dashboard.module.scss';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/me').then(response => console.log(response));
  }, []);

  return (
    <>
      <Head title="Dashboard" />

      <main className={styles.container}>
        <h1>Dashboard: {user?.email}</h1>
      </main>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async ctx => {
  const apiClient = setupAPIClient(ctx);
  const response = await api.get('/mi');

  return {
    props: {},
  };
});
