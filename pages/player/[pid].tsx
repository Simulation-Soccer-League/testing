import { Alert, AlertIcon, AlertTitle, Button } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useCallback, useContext, useState } from 'react';

import { PermissionGuard } from '../../components/auth/PermissionGuard';
import { PageWrapper } from '../../components/common/PageWrapper';
import { FullPlayerSheet } from '../../components/playerForms/common/FullPlayerSheet';
import {
  AttributeChange,
  EditAttributesForm,
} from '../../components/playerForms/editAttributes/EditAttributesForm';
import { useSession } from '../../contexts/AuthContext';
import { ToastContext } from '../../contexts/ToastContext';
import { useOtherPlayer } from '../../hooks/useOtherPlayer';
import { useSeason } from '../../hooks/useSeason';
import { GoalieAttributes, Player, SkaterAttributes } from '../../typings';
import { mutate } from '../../utils/query';

export default ({ playerId }: { playerId: number }) => {
  const { loggedIn, session } = useSession();
  const { season } = useSeason();
  const { player, loading } = useOtherPlayer(playerId);
  const [isRegressingPlayer, setIsRegressingPlayer] = useState<boolean>(false);
  const setIsRegressing = useCallback(() => {
    setIsRegressingPlayer(true);
  }, []);
  const queryClient = useQueryClient();
  const { addToast } = useContext(ToastContext);

  const updatePlayer = useMutation<
    // TODO: type return type
    unknown,
    unknown,
    // TODO: type variables a bit stricter
    Record<string, unknown>
  >({
    mutationFn: (variables) =>
      mutate('api/v1/player/update', variables, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }),
  });

  const submitEdit = useCallback(
    async (
      changes: AttributeChange[],
      info: Partial<Player>,
      goalie?: Partial<GoalieAttributes>,
      skater?: Partial<SkaterAttributes>,
    ) =>
      updatePlayer.mutate(
        {
          type: 'Regression',
          changes,
          info,
          goalie,
          skater,
        },
        {
          onError: (e) => {
            addToast({
              title: `Changes not saved`,
              description: `We were unable to perform your regression. Please try again.`,
              status: 'error',
            });
            throw new Error(`error: ${e}`);
          },
          onSettled: () => {
            setIsRegressingPlayer(false);
            addToast({
              title: `Player successfully updated`,
              description: `Your attribute changes for your regressionhave been applied.`,
              status: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['otherPlayerInfo'] });
          },
        },
      ),
    [queryClient, addToast, updatePlayer],
  );

  return (
    <PageWrapper loading={loading}>
      <div className="flex items-center justify-center">
        <div className="my-4 flex w-11/12 flex-col lg:w-3/5">
          {!player && (
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <AlertIcon />
              <AlertTitle>Player Not Found</AlertTitle>
            </Alert>
          )}
          {player && (
            <>
              {isRegressingPlayer && loggedIn ? (
                <EditAttributesForm
                  player={player}
                  attributeFormType={'Regression'}
                  season={season}
                  onSubmitCallback={submitEdit}
                  onCancel={() => setIsRegressingPlayer(false)}
                />
              ) : (
                <FullPlayerSheet
                  player={player}
                  attributeMenu={
                    <>
                      {loggedIn && (
                        <PermissionGuard userPermissions="canHandlePlayerRegression">
                          <Button
                            isDisabled={
                              (player.appliedTPE ?? 0) <=
                                (player.totalTPE ?? 0) ||
                              player.status !== 'active'
                            }
                            onClick={() => setIsRegressing()}
                          >
                            Regress
                          </Button>
                        </PermissionGuard>
                      )}
                    </>
                  }
                  readOnly
                />
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { pid } = query;

  return {
    props: {
      playerId: pid,
    },
  };
};
