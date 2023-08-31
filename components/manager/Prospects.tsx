import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useMemo, useState } from 'react';

import { useSession } from '../../contexts/AuthContext';
import { ToastContext } from '../../contexts/ToastContext';
import { Player, Team } from '../../typings';
import { mutate, query } from '../../utils/query';
import { PlayerTable } from '../common/tables/PlayerTable';

import { ActionModal } from './common/ActionModal';

export const Prospects = ({
  teamID,
  shlTeams,
}: {
  teamID: number;
  shlTeams: Team[];
}) => {
  const { session } = useSession();
  const { addToast } = useContext(ToastContext);
  const queryClient = useQueryClient();

  const [actionedPlayer, setActionedPlayer] = useState<Player | undefined>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data, isLoading } = useQuery<Player[]>({
    queryKey: ['playerProspects'],
    queryFn: () =>
      query(
        `api/v1/player?leagueID=1&teamRightsID=none&status=active`,
        undefined,
      ),
  });

  const submitTransaction = useMutation<
    // TODO: type return type
    unknown,
    unknown,
    // TODO: type variables a bit stricter
    Record<string, unknown>
  >({
    mutationFn: (variables) =>
      mutate('api/v1/manager/transaction/prospect', variables, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }),
  });

  const teamNames = useMemo(
    () => ({
      new: shlTeams.find((team) => team.id === teamID)?.name,
    }),
    [teamID, shlTeams],
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    submitTransaction.mutate(
      {
        pid: actionedPlayer?.pid,
        newName: teamNames.new,
      },
      {
        onError: () => {
          addToast({
            title: `Error`,
            description: `Could not assign ${actionedPlayer?.name} as a prospect. Please try again.`,
            status: 'error',
          });
        },
        onSuccess: () => {
          addToast({
            title: `Complete`,
            description: `${actionedPlayer?.name} successfully added as a prospect.`,
            status: 'success',
          });
          setActionedPlayer(undefined);
          queryClient.invalidateQueries({ queryKey: ['playerProspects'] });
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <>
      <PlayerTable
        data={data ?? []}
        linkTarget="_blank"
        isLoading={isLoading}
        actionConfig={{ action: 'Assign', callback: setActionedPlayer }}
      />
      <ActionModal
        action="Assign"
        player={actionedPlayer}
        setPlayer={setActionedPlayer}
        callback={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
};
