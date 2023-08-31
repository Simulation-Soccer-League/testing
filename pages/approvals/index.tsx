import { useQuery } from '@tanstack/react-query';

import { PermissionGuard } from '../../components/auth/PermissionGuard';
import { PageWrapper } from '../../components/common/PageWrapper';
import { UpdateEventsManagementTable } from '../../components/common/tables/UpdateEventsManagementTable';
import { useRedirectIfUnauthed } from '../../hooks/useRedirectIfUnauthed';
import { UpdateEvents } from '../../typings';
import { query } from '../../utils/query';

export default () => {
  const { data, isLoading } = useQuery<UpdateEvents[]>({
    queryKey: ['approvals'],
    queryFn: () => query(`api/v1/updateevents?status=pending`, undefined),
  });

  useRedirectIfUnauthed('/', { roles: ['SHL_HO', 'SMJHL_HO', 'SMJHL_INTERN'] });

  return (
    <PageWrapper>
      <div className="flex items-center justify-center">
        <div className="my-4 flex w-11/12 flex-col space-y-4 lg:w-3/5">
          <div className="bg-grey900 p-2 text-xl text-grey100">Approvals</div>
          <PermissionGuard userPermissions="canApprovePlayers">
            <UpdateEventsManagementTable
              data={data ?? []}
              isLoading={isLoading}
            />
          </PermissionGuard>
        </div>
      </div>
    </PageWrapper>
  );
};
