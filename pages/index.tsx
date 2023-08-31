import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { PageWrapper } from '../components/common/PageWrapper';
import { useSession } from '../contexts/AuthContext';
import { useCurrentPlayer } from '../hooks/useCurrentPlayer';

export default () => {
  const { loggedIn } = useSession();
  const { player, loading } = useCurrentPlayer();

  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      router.replace('/login');
    }

    if (loggedIn && player && !loading) {
      if (player.status === 'retired' || player.status === 'denied') {
        router.replace('/create');
      } else {
        router.replace('/player');
      }
    }
  }, [loading, loggedIn, player, router]);

  return (
    <PageWrapper loading={loggedIn ? loading : false}>
      <div />
    </PageWrapper>
  );
};
