import { useContext } from 'react';

import { AuthContext } from '@contexts/AuthContext';
import Head from '@components/Head';

import styles from '@page-styles/dashboard.module.scss';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Head title="Dashboard" />

      <main className={styles.container}>
        <h1>Dashboard: {user?.email}</h1>
      </main>
    </>
  );
}
