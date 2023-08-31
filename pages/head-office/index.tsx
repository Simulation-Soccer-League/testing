import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { memo, useEffect, useMemo } from 'react';

import { PermissionGuard } from '../../components/auth/PermissionGuard';
import { RoleGuard } from '../../components/auth/RoleGuard';
import { PageWrapper } from '../../components/common/PageWrapper';
import { GMManagement } from '../../components/head-office/GMManagment';
import { NewSeason } from '../../components/head-office/NewSeason';
import { PlayerManagement } from '../../components/head-office/PlayerManagement';
import { useSession } from '../../contexts/AuthContext';
import { useRedirectIfUnauthed } from '../../hooks/useRedirectIfUnauthed';
import { GeneralManager } from '../../typings';
import { query } from '../../utils/query';

export default () => {
  const { loggedIn } = useSession();

  useRedirectIfUnauthed('/', {
    roles: [
      'SHL_COMMISSIONER',
      'SMJHL_COMMISSIONER',
      'SHL_HO',
      'SMJHL_HO',
      'SMJHL_INTERN',
    ],
  });

  const { data: managers, isLoading: managersLoading } = useQuery<
    GeneralManager[]
  >({
    queryKey: ['managementManagers'],
    queryFn: () => query('/api/v1/manager'),
  });

  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      router.replace('/');
    }
  }, [loggedIn, router]);

  const { shlManagers, smjhlManagers } = useMemo(() => {
    return {
      shlManagers: managers?.filter((manager) => manager.leagueID === 0) ?? [],
      smjhlManagers:
        managers?.filter((manager) => manager.leagueID === 1) ?? [],
    };
  }, [managers]);

  const MemoizedSHLManagement = memo(() => (
    <GMManagement leagueID={0} managers={shlManagers} />
  ));

  const MemoizedSMJHLManagement = memo(() => (
    <GMManagement leagueID={1} managers={smjhlManagers} />
  ));

  return (
    <PageWrapper loading={managersLoading}>
      <div className="flex items-center justify-center">
        <div className="my-4 flex w-11/12 flex-col space-y-4 lg:w-3/5">
          <div className="bg-grey900 p-2 text-xl text-grey100">Head Office</div>
          <RoleGuard
            userRoles={[
              'SMJHL_HO',
              'SHL_HO',
              'SHL_COMMISSIONER',
              'SMJHL_COMMISSIONER',
              'SMJHL_INTERN',
            ]}
          >
            <Tabs isFitted isLazy variant="enclosed-colored">
              <TabList>
                <Tab>GM Management</Tab>
                <Tab>Player Management</Tab>
                <PermissionGuard userPermissions="canStartNextSeason">
                  <Tab>New Season</Tab>
                </PermissionGuard>
              </TabList>
              <TabPanels>
                <TabPanel paddingX={0}>
                  <Tabs isLazy>
                    <TabList>
                      <Tab>SHL</Tab>

                      <Tab>SMJHL</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                        <PermissionGuard
                          userPermissions="canAssignSHLGMRole"
                          fallback={
                            <div>You don&apos;t have permissions for this.</div>
                          }
                        >
                          <MemoizedSHLManagement />
                        </PermissionGuard>
                      </TabPanel>
                      <TabPanel>
                        <PermissionGuard
                          userPermissions="canAssignSMJHLGMRole"
                          fallback={
                            <div>You don&apos;t have permissions for this.</div>
                          }
                        >
                          <MemoizedSMJHLManagement />
                        </PermissionGuard>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </TabPanel>
                <TabPanel>
                  <PlayerManagement />
                </TabPanel>
                <PermissionGuard userPermissions="canStartNextSeason">
                  <TabPanel>
                    <NewSeason />
                  </TabPanel>
                </PermissionGuard>
              </TabPanels>
            </Tabs>
          </RoleGuard>
        </div>
      </div>
    </PageWrapper>
  );
};
